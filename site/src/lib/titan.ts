/**
 * Titan-nano inference in plain TypeScript: no ML libraries.
 *
 * A line-for-line re-implementation of research/titan-nano/model.py:
 *   x = tok[id] + pos[t]
 *   for each block: x += proj(Attn(LN1(x)));  x += out(GELU(fc(LN2(x))))
 *   logits = LN_f(x) · tokᵀ   (tied output head)
 * Weights arrive as int8 with one float32 scale per output row (2-D tensors)
 * and float32 for biases and LayerNorm, exactly as written by export.py.
 *
 * Generation is incremental: keys and values of earlier positions are cached,
 * so each new character costs one pass through the network. Every step also
 * returns the real attention weights, which the /ai page draws.
 */

export type TitanConfig = { vocab_size: number; ctx: number; n_layer: number; n_head: number; d_model: number };
type TensorEntry = { name: string; shape: number[]; dtype: "i8" | "f32"; offset: number; scale_offset?: number };
export type TitanManifest = { config: TitanConfig; vocab: string[]; tensors: TensorEntry[] };

/** A weight matrix [rows, cols] stored as int8 + per-row scale, or plain float32. */
class Mat {
  readonly rows: number;
  readonly cols: number;
  private readonly q: Int8Array | null;
  private readonly scale: Float32Array | null;
  private readonly f: Float32Array | null;

  constructor(rows: number, cols: number, q: Int8Array | null, scale: Float32Array | null, f: Float32Array | null) {
    this.rows = rows;
    this.cols = cols;
    this.q = q;
    this.scale = scale;
    this.f = f;
  }

  /** out[r] = dot(row r, x) (+ bias). This is x·Wᵀ for a PyTorch Linear weight. */
  matvec(x: Float32Array, out: Float32Array, bias?: Float32Array): Float32Array {
    const { rows, cols } = this;
    for (let r = 0; r < rows; r++) {
      let acc = 0;
      const base = r * cols;
      if (this.q) {
        const q = this.q;
        for (let c = 0; c < cols; c++) acc += q[base + c] * x[c];
        acc *= this.scale![r];
      } else {
        const f = this.f!;
        for (let c = 0; c < cols; c++) acc += f[base + c] * x[c];
      }
      out[r] = bias ? acc + bias[r] : acc;
    }
    return out;
  }

  /** Copy row r (dequantised) into out. Used for embedding lookups. */
  row(r: number, out: Float32Array): Float32Array {
    const base = r * this.cols;
    if (this.q) {
      const s = this.scale![r];
      for (let c = 0; c < this.cols; c++) out[c] = this.q[base + c] * s;
    } else {
      for (let c = 0; c < this.cols; c++) out[c] = this.f![base + c];
    }
    return out;
  }
}

type Block = {
  ln1w: Float32Array; ln1b: Float32Array; qkv: Mat; qkvb: Float32Array; proj: Mat; projb: Float32Array;
  ln2w: Float32Array; ln2b: Float32Array; fc: Mat; fcb: Float32Array; out: Mat; outb: Float32Array;
};

export type StepResult = {
  /** Probability of every vocabulary entry for the next character. */
  probs: Float32Array;
  /** attention[layer][head] = weights over positions 0..t (they sum to 1). */
  attention: Float32Array[][];
};

const GELU_C = Math.sqrt(2 / Math.PI);
const gelu = (x: number) => 0.5 * x * (1 + Math.tanh(GELU_C * (x + 0.044715 * x * x * x)));

function layerNorm(x: Float32Array, w: Float32Array, b: Float32Array, out: Float32Array, eps = 1e-5): Float32Array {
  const n = x.length;
  let mean = 0;
  for (let i = 0; i < n; i++) mean += x[i];
  mean /= n;
  let v = 0;
  for (let i = 0; i < n; i++) v += (x[i] - mean) ** 2;
  const inv = 1 / Math.sqrt(v / n + eps);
  for (let i = 0; i < n; i++) out[i] = (x[i] - mean) * inv * w[i] + b[i];
  return out;
}

export class Titan {
  readonly cfg: TitanConfig;
  readonly vocab: string[];
  private readonly stoi: Map<string, number>;
  private readonly tok: Mat;
  private readonly pos: Mat;
  private readonly blocks: Block[];
  private readonly lnfw: Float32Array;
  private readonly lnfb: Float32Array;
  // KV cache: [layer] -> Float32Array(ctx * d_model)
  private kCache: Float32Array[];
  private vCache: Float32Array[];
  private t = 0;

  constructor(manifest: TitanManifest, buffer: ArrayBuffer) {
    this.cfg = manifest.config;
    this.vocab = manifest.vocab;
    this.stoi = new Map(this.vocab.map((c, i) => [c, i]));
    const byName = new Map(manifest.tensors.map((e) => [e.name, e]));
    const f32 = (name: string): Float32Array => {
      const e = byName.get(name);
      if (!e) throw new Error(`missing tensor ${name}`);
      const n = e.shape.reduce((a, b) => a * b, 1);
      return new Float32Array(buffer, e.offset, n);
    };
    const mat = (name: string): Mat => {
      const e = byName.get(name);
      if (!e) throw new Error(`missing tensor ${name}`);
      const [rows, cols] = e.shape;
      if (e.dtype === "i8") {
        return new Mat(rows, cols, new Int8Array(buffer, e.offset, rows * cols), new Float32Array(buffer, e.scale_offset!, rows), null);
      }
      return new Mat(rows, cols, null, null, new Float32Array(buffer, e.offset, rows * cols));
    };
    this.tok = mat("tok.weight");
    this.pos = mat("pos.weight");
    this.blocks = Array.from({ length: this.cfg.n_layer }, (_, i) => {
      const p = `blocks.${i}.`;
      return {
        ln1w: f32(p + "ln1.weight"), ln1b: f32(p + "ln1.bias"),
        qkv: mat(p + "attn.qkv.weight"), qkvb: f32(p + "attn.qkv.bias"),
        proj: mat(p + "attn.proj.weight"), projb: f32(p + "attn.proj.bias"),
        ln2w: f32(p + "ln2.weight"), ln2b: f32(p + "ln2.bias"),
        fc: mat(p + "fc.weight"), fcb: f32(p + "fc.bias"),
        out: mat(p + "out.weight"), outb: f32(p + "out.bias"),
      };
    });
    this.lnfw = f32("ln_f.weight");
    this.lnfb = f32("ln_f.bias");
    this.kCache = [];
    this.vCache = [];
    this.reset();
  }

  /** Encode text; characters outside the vocabulary become "?" (as in training). */
  encode(text: string): number[] {
    const unk = this.stoi.get("?")!;
    return [...text.replace(/\r\n?/g, "\n").replace(/\t/g, "    ")].map((c) => this.stoi.get(c) ?? unk);
  }

  get length(): number {
    return this.t;
  }

  reset(): void {
    const { n_layer, ctx, d_model } = this.cfg;
    this.kCache = Array.from({ length: n_layer }, () => new Float32Array(ctx * d_model));
    this.vCache = Array.from({ length: n_layer }, () => new Float32Array(ctx * d_model));
    this.t = 0;
  }

  /** Feed one token at the next position; returns next-token probabilities and this step's attention. */
  step(id: number): StepResult {
    const { d_model: C, n_head: H, ctx, vocab_size: V } = this.cfg;
    if (this.t >= ctx) throw new Error("context full: call reset() and re-feed the last characters");
    const t = this.t;
    const hd = C / H;
    const scale = 1 / Math.sqrt(hd);

    const x = this.tok.row(id, new Float32Array(C));
    const p = this.pos.row(t, new Float32Array(C));
    for (let i = 0; i < C; i++) x[i] += p[i];

    const h = new Float32Array(C);
    const qkv = new Float32Array(3 * C);
    const y = new Float32Array(C);
    const a = new Float32Array(C);
    const f = new Float32Array(4 * C);
    const m = new Float32Array(C);
    const attention: Float32Array[][] = [];

    this.blocks.forEach((b, li) => {
      // --- attention ---
      layerNorm(x, b.ln1w, b.ln1b, h);
      b.qkv.matvec(h, qkv, b.qkvb);
      const K = this.kCache[li], Vc = this.vCache[li];
      K.set(qkv.subarray(C, 2 * C), t * C);
      Vc.set(qkv.subarray(2 * C, 3 * C), t * C);
      const heads: Float32Array[] = [];
      for (let hh = 0; hh < H; hh++) {
        const off = hh * hd;
        const w = new Float32Array(t + 1);
        let max = -Infinity;
        for (let s = 0; s <= t; s++) {
          let d = 0;
          for (let i = 0; i < hd; i++) d += qkv[off + i] * K[s * C + off + i];
          w[s] = d * scale;
          if (w[s] > max) max = w[s];
        }
        let sum = 0;
        for (let s = 0; s <= t; s++) sum += (w[s] = Math.exp(w[s] - max));
        for (let s = 0; s <= t; s++) w[s] /= sum;
        for (let i = 0; i < hd; i++) {
          let acc = 0;
          for (let s = 0; s <= t; s++) acc += w[s] * Vc[s * C + off + i];
          y[off + i] = acc;
        }
        heads.push(w);
      }
      attention.push(heads);
      b.proj.matvec(y, a, b.projb);
      for (let i = 0; i < C; i++) x[i] += a[i];
      // --- MLP ---
      layerNorm(x, b.ln2w, b.ln2b, h);
      b.fc.matvec(h, f, b.fcb);
      for (let i = 0; i < f.length; i++) f[i] = gelu(f[i]);
      b.out.matvec(f, m, b.outb);
      for (let i = 0; i < C; i++) x[i] += m[i];
    });

    layerNorm(x, this.lnfw, this.lnfb, h);
    const logits = this.tok.matvec(h, new Float32Array(V)); // tied head
    let max = -Infinity;
    for (let i = 0; i < V; i++) if (logits[i] > max) max = logits[i];
    let sum = 0;
    const probs = new Float32Array(V);
    for (let i = 0; i < V; i++) sum += (probs[i] = Math.exp(logits[i] - max));
    for (let i = 0; i < V; i++) probs[i] /= sum;
    this.t++;
    return { probs, attention };
  }

  /** Reset and feed a whole prompt; returns the result of the last step. */
  prime(text: string): StepResult {
    this.reset();
    const ids = this.encode(text).slice(-this.cfg.ctx);
    let r: StepResult | undefined;
    for (const id of ids) r = this.step(id);
    if (!r) throw new Error("empty prompt");
    return r;
  }

  /** Log of the raw scores for parity tests: log-probabilities equal logits up to a constant. */
  static logProbs(probs: Float32Array): Float32Array {
    return probs.map((p) => Math.log(p));
  }
}

/** Pick the next token: greedy when temperature is 0, otherwise sample from the top-k. */
export function choose(probs: Float32Array, temperature: number, topK: number, rand: () => number = Math.random): number {
  if (temperature <= 0) {
    let best = 0;
    for (let i = 1; i < probs.length; i++) if (probs[i] > probs[best]) best = i;
    return best;
  }
  const idx = Array.from(probs.keys()).sort((a, b) => probs[b] - probs[a]).slice(0, topK);
  const w = idx.map((i) => Math.pow(probs[i], 1 / temperature));
  const total = w.reduce((s, v) => s + v, 0);
  let r = rand() * total;
  for (let j = 0; j < idx.length; j++) {
    r -= w[j];
    if (r <= 0) return idx[j];
  }
  return idx[idx.length - 1];
}
