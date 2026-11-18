/**
 * Parity test: the browser engine (site/src/lib/titan.ts) must reproduce PyTorch.
 *
 * export.py writes, for three prompts, the int8 model's last-position logits and
 * a 60-character greedy continuation computed in PyTorch. This test loads the
 * same weights.bin, runs titan.ts, and checks:
 *   1. log-probabilities match PyTorch's (after removing the softmax constant) to 2e-3
 *   2. the greedy continuation is identical, character for character
 *
 * Run from the repo root:
 *   node --experimental-strip-types research/titan-nano/parity.test.ts runs/titan-nano-v1
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Titan, choose, type TitanManifest } from "../../site/src/lib/titan.ts";

const run = process.argv[2] ?? "runs/titan-nano-v1";
const here = dirname(fileURLToPath(import.meta.url));
const modelDir = join(here, "../../site/public/models/titan-nano");
const manifest = JSON.parse(readFileSync(join(modelDir, "model.json"), "utf8")) as TitanManifest;
const bin = readFileSync(join(modelDir, "weights.bin"));
const buffer = bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength);
const refs = JSON.parse(readFileSync(join(here, run, "parity.json"), "utf8")) as {
  prompt: string; last_logits: number[]; greedy: string;
}[];

const model = new Titan(manifest, buffer);
let failures = 0;

for (const ref of refs) {
  // 1. Log-probabilities vs PyTorch logits: equal up to an additive constant.
  const lp = Titan.logProbs(model.prime(ref.prompt).probs);
  const ptMax = Math.max(...ref.last_logits);
  const ptLse = ptMax + Math.log(ref.last_logits.reduce((s, v) => s + Math.exp(v - ptMax), 0));
  let maxDiff = 0;
  ref.last_logits.forEach((v, i) => (maxDiff = Math.max(maxDiff, Math.abs(v - ptLse - lp[i]))));

  // 2. Greedy continuation, same procedure as export.py (re-prime with the last ctx chars each step).
  let text = ref.prompt;
  let out = "";
  for (let i = 0; i < ref.greedy.length; i++) {
    const r = model.prime(text.slice(-manifest.config.ctx));
    const ch = manifest.vocab[choose(r.probs, 0, 1)];
    out += ch;
    text += ch;
  }
  const ok = maxDiff < 2e-3 && out === ref.greedy;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  prompt=${JSON.stringify(ref.prompt).slice(0, 40)}  max|Δ log p|=${maxDiff.toExponential(2)}  greedy ${out === ref.greedy ? "identical" : "DIFFERS"}`);
  if (out !== ref.greedy) console.log(`   torch: ${JSON.stringify(ref.greedy)}\n   js:    ${JSON.stringify(out)}`);
}
process.exit(failures ? 1 : 0);
