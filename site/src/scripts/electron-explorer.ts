/**
 * Electron explorer for "What does a sentence cost in electrons?".
 * Mounts into any <div data-electron-explorer data-src="...json"> in a post.
 * All numbers come from the JSON, which is computed from the post's data files
 * (make_explorer_data.py); this script only does E = M * E_MAC and N = E / (qV).
 * Bundled as an external module (the CSP forbids inline scripts).
 */

type Supply = { v: number; ideal: number; variation: number; cycle_ideal: number; cycle_variation: number };
type Lang = { code: string; name: string | null; tokens: number; n: number; macs: number; ratio: number; lo: number; hi: number; chain: Record<string, number[]> };
type Chain = { configs: string[]; english_quadratic_share: Record<string, number>; out_sentences: number; e_mac: string; e_bit: string };
type Data = { q: number; m_lin: number; att_per_ctx: number; electrons_per_dot: number; supplies: Supply[]; chain: Chain; languages: Lang[] };

const SUP = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
function sci(x: number, digits = 2): string {
  if (x === 0) return "0";
  const e = Math.floor(Math.log10(Math.abs(x)));
  const m = x / 10 ** e;
  const exp = String(Math.abs(e)).split("").map((d) => SUP[+d]).join("");
  return `${m.toFixed(digits - 1)} × 10${e < 0 ? "⁻" : ""}${exp}`;
}
function joules(j: number): string {
  if (j >= 1) return `${j.toPrecision(3)} J`;
  if (j >= 1e-3) return `${(j * 1e3).toPrecision(3)} mJ`;
  return `${(j * 1e6).toPrecision(3)} µJ`;
}
/** Round half up to d decimals (toFixed misrounds values like 31.45). */
function fx(x: number, d = 1): string {
  const k = 10 ** d;
  return (Math.round(x * k + 1e-9) / k).toFixed(d);
}
function label(l: Lang): string {
  return l.name ?? l.code;
}
function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

class DotField {
  canvas: HTMLCanvasElement;
  color: string;
  raf = 0;
  constructor(color: string) {
    this.canvas = el("canvas", "ee-dots");
    this.canvas.setAttribute("aria-hidden", "true");
    this.color = color;
  }
  /** Draw `count` dots in a grid of `cols` columns and `rows` rows; electrons flow down from the supply rail. */
  draw(count: number, cols: number, rows: number) {
    cancelAnimationFrame(this.raf);
    const pitch = 8, r = 2.9, top = 10;
    const dpr = window.devicePixelRatio || 1;
    const w = cols * pitch + 4, h = top + rows * pitch + 4;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = `${w}px`;
    const ctx = this.canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rail = getComputedStyle(this.canvas).color;
    const start = performance.now();
    const dur = reduceMotion ? 0 : 900;
    const frame = (now: number) => {
      const t = dur === 0 ? 1 : Math.min(1, (now - start) / dur);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = rail;
      ctx.fillRect(0, 0, w, 3);
      ctx.fillStyle = this.color;
      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / cols), col = i % cols;
        const delay = (row / Math.max(rows, 1)) * 0.5;
        const p = Math.max(0, Math.min(1, (t - delay) / 0.5));
        if (p <= 0) continue;
        const y = top + row * pitch + r;
        const yy = 3 + (y - 3) * (1 - (1 - p) ** 3);
        ctx.beginPath();
        ctx.arc(2 + col * pitch + r, yy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (t < 1) this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }
}

function panel(title: string, color: string) {
  const root = el("div", "ee-panel");
  const head = el("p", "ee-lang");
  const swatch = el("span", "ee-swatch");
  swatch.style.background = color;
  const name = el("span", undefined, title);
  head.append(swatch, name);
  const dl = el("dl", "ee-stats");
  const rows: Record<string, HTMLElement> = {};
  for (const [k, t] of [["tokens", "Tokens"], ["macs", "Multiply-adds"], ["energy", "Energy"], ["electrons", "Electrons"]] as const) {
    const dt = el("dt", undefined, t);
    const dd = el("dd");
    dl.append(dt, dd);
    rows[k] = dd;
  }
  const dots = new DotField(color);
  root.append(head, dl, dots.canvas);
  return { root, name, rows, dots };
}

async function mount(host: HTMLElement) {
  const src = host.dataset.src;
  if (!src) return;
  let data: Data;
  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error(String(res.status));
    data = await res.json();
  } catch {
    return; // keep the no-JS fallback text
  }
  const eng = data.languages.find((l) => l.code === "eng_Latn")!;
  const sups = [...data.supplies].sort((a, b) => b.v - a.v);
  const s18 = sups.find((s) => s.v === 1.8)!;
  const BLUE = "#2a78d6", ORANGE = "#eb6834";

  host.replaceChildren();
  host.classList.add("ee");

  const title = el("p", "ee-title", "Try it: one sentence, any of 204 languages");
  const intro = el("p", "ee-intro");

  // mode switch: arithmetic on a sky130 chip, or the whole request on a GPU server
  const tabs = el("div", "ee-tabs");
  tabs.setAttribute("role", "group");
  tabs.setAttribute("aria-label", "What to count");
  const tabChip = el("button", "ee-tab", "Arithmetic on a chip (electrons)");
  const tabServer = el("button", "ee-tab", "Whole request on a GPU server (memory too)");
  for (const b of [tabChip, tabServer]) b.type = "button";
  tabs.append(tabChip, tabServer);

  const common = el("div", "ee-controls");
  const controls = el("div", "ee-controls");
  const langLabel = el("label", "ee-control");
  langLabel.append(el("span", undefined, "Language"));
  const select = el("select");
  const named = el("optgroup");
  named.label = "Named in Deng et al.'s table";
  const coded = el("optgroup");
  coded.label = "Other FLORES languages (code)";
  for (const l of data.languages) {
    if (l.code === "eng_Latn") continue;
    const o = el("option", undefined, label(l));
    o.value = l.code;
    (l.name ? named : coded).append(o);
  }
  select.append(named, coded);
  select.value = "ory_Orya";
  langLabel.append(select);

  const voltLabel = el("label", "ee-control");
  const voltText = el("span");
  const slider = el("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = String(sups.length - 1);
  slider.step = "1";
  slider.value = "0";
  const ends = el("span", "ee-ends");
  ends.append(el("span", undefined, `${sups[0].v.toFixed(2)} V, fast`), el("span", undefined, `${sups[sups.length - 1].v.toFixed(2)} V, frugal`));
  voltLabel.append(voltText, slider, ends);

  const varLabel = el("label", "ee-check");
  const check = el("input");
  check.type = "checkbox";
  varLabel.append(check, el("span", undefined, "Count chip-to-chip variation (clock waits for slow copies)"));
  common.append(langLabel);
  controls.append(voltLabel, varLabel);

  const panels = el("div", "ee-panels");
  const left = panel("English", BLUE);
  const right = panel("", ORANGE);
  panels.append(left.root, right.root);

  const result = el("p", "ee-result");
  result.setAttribute("aria-live", "polite");
  const formula = el("p", "ee-formula");
  const legend = el("p", "ee-note");
  const note = el("p", "ee-note",
    "Labels: multiply-adds derived (section 2); energy per multiply-add simulated (sky130, typical corner, 27 °C, section 7). Arithmetic only, as a lower bound: no memory traffic, no wires. Sentence lengths are FLORES means rounded to whole tokens.");

  const chipBox = el("div", "ee-box");
  chipBox.append(controls, panels, result, formula, legend, note);

  // ---- server mode
  const serverBox = el("div", "ee-box");
  const sControls = el("div", "ee-controls");
  const lenLabel = el("label", "ee-control");
  lenLabel.append(el("span", undefined, "What the user sends"));
  const lenSel = el("select");
  for (const [v, t] of [["1", "One sentence"], ["20", "A page (20 sentences)"], ["200", "A long document (200 sentences)"]]) {
    const o = el("option", undefined, t);
    o.value = v;
    lenSel.append(o);
  }
  lenSel.value = "20";
  lenLabel.append(lenSel);
  const srvLabel = el("label", "ee-control");
  srvLabel.append(el("span", undefined, "Server"));
  const srvSel = el("select");
  for (const [v, t] of [["1", "Alone on the GPU"], ["64", "Shared with 64 users"]]) {
    const o = el("option", undefined, t);
    o.value = v;
    srvSel.append(o);
  }
  srvSel.value = "64";
  srvLabel.append(srvSel);
  sControls.append(lenLabel, srvLabel);

  const SEG = [["Arithmetic", "#6250d6"], ["Reading weights", "#1baf7a"], ["Reading the KV cache", "#eda100"]] as const;
  const sPanels = el("div", "ee-panels");
  const mkServerPanel = (color: string) => {
    const root = el("div", "ee-panel");
    const head = el("p", "ee-lang");
    const sw = el("span", "ee-swatch");
    sw.style.background = color;
    const name = el("span");
    head.append(sw, name);
    const dl = el("dl", "ee-stats");
    const rows: Record<string, HTMLElement> = {};
    for (const [k, t] of [["io", "Tokens in / out"], ["energy", "Energy per request"]] as const) {
      dl.append(el("dt", undefined, t));
      rows[k] = el("dd");
      dl.append(rows[k]);
    }
    const track = el("div", "ee-bar");
    track.setAttribute("aria-hidden", "true");
    const segs = SEG.map(([, c]) => {
      const s = el("span", "ee-seg");
      s.style.background = c;
      track.append(s);
      return s;
    });
    const shares = el("p", "ee-shares");
    root.append(head, dl, track, shares);
    return { root, name, rows, track, segs, shares };
  };
  const sLeft = mkServerPanel(BLUE), sRight = mkServerPanel(ORANGE);
  sLeft.name.textContent = "English";
  sPanels.append(sLeft.root, sRight.root);
  const segLegend = el("p", "ee-seglegend");
  for (const [t, c] of SEG) {
    const item = el("span");
    const sw = el("span", "ee-swatch");
    sw.style.background = c;
    item.append(sw, document.createTextNode(t));
    segLegend.append(item);
  }
  const sResult = el("p", "ee-result");
  sResult.setAttribute("aria-live", "polite");
  const sFormula = el("p", "ee-formula");
  const sNote = el("p", "ee-note",
    `Energies use published figures: a 45 nm 16-bit multiply-add (1.5 pJ, Horowitz 2014) and GDDR6 memory (7.5 pJ per bit, Micron). The user also gets ${data.chain.out_sentences} sentences back. No electron count here, because we do not model the GPU's supply voltages. The range covers three multiply-add energies, three memory energies and the token count's 95% interval. Section 8 derives the formula.`);
  serverBox.append(sControls, sPanels, segLegend, sResult, sFormula, sNote);

  host.append(title, intro, tabs, common, chipBox, serverBox);

  let mode: "chip" | "server" = "chip";

  const updateServer = () => {
    const lang = data.languages.find((l) => l.code === select.value)!;
    const k = `N${lenSel.value}_b${srvSel.value}`;
    const [eJ, , , , ea, ew, ek] = eng.chain[k];
    const [lJ, ratio, lo, hi, la, lw, lk] = lang.chain[k];
    const N = +lenSel.value, O = data.chain.out_sentences;
    const io = (l: Lang) => `${Math.round(N * l.tokens).toLocaleString("en")} / ${Math.round(O * l.tokens).toLocaleString("en")}`;
    sRight.name.textContent = label(lang) + (lang.name ? "" : " (FLORES code)");
    sLeft.rows.io.textContent = io(eng);
    sRight.rows.io.textContent = io(lang);
    sLeft.rows.energy.textContent = joules(eJ);
    sRight.rows.energy.textContent = joules(lJ);
    const max = Math.max(eJ, lJ);
    const draw = (p: ReturnType<typeof mkServerPanel>, J: number, sh: number[]) => {
      p.track.style.width = `${Math.max(2, (100 * J) / max)}%`;
      sh.forEach((s, i) => (p.segs[i].style.flexGrow = String(s)));
      p.shares.textContent = SEG.map(([t], i) => `${t} ${Math.round(sh[i] * 100)}%`).join(" · ");
    };
    draw(sLeft, eJ, [ea, ew, ek]);
    draw(sRight, lJ, [la, lw, lk]);
    const r = lang.ratio, s = data.chain.english_quadratic_share[k];
    sResult.textContent =
      `${label(lang)} needs ${r.toFixed(2)}× English's tokens, but this request costs ${fx(ratio)}× English's energy ` +
      `(range ${fx(lo)} to ${fx(hi)}×).` +
      (ratio > r * 1.05
        ? " The gap grows past the token gap because the context-dependent work grows with the square of the length."
        : " Here the energy gap tracks the token gap, because fixed per-token work dominates.");
    sFormula.textContent =
      `G = r (1 + (r − 1) s) = ${r.toFixed(2)} × (1 + ${(r - 1).toFixed(2)} × ${s.toFixed(3)}) = ${fx(r * (1 + (r - 1) * s))}` +
      `   (full model: ${fx(ratio)}; s = English's share of context-dependent work)`;
  };

  const setMode = (m: "chip" | "server") => {
    mode = m;
    tabChip.setAttribute("aria-pressed", String(m === "chip"));
    tabServer.setAttribute("aria-pressed", String(m === "server"));
    chipBox.hidden = m !== "chip";
    serverBox.hidden = m !== "server";
    intro.textContent = m === "chip"
      ? "Pick a language and a supply voltage. The explorer counts the multiply-adds Qwen3-8B needs to read one average FLORES sentence, then the electrons a sky130 chip pulls from its supply to do them."
      : "Now count everything a real request costs: the arithmetic, reading the model's 15 GB of weights, and reading each user's KV cache. When many users share a GPU the weight reads are shared too, and the language gap grows past the token gap.";
    (m === "chip" ? update : updateServer)();
  };

  tabChip.addEventListener("click", () => setMode("chip"));
  tabServer.addEventListener("click", () => setMode("server"));
  lenSel.addEventListener("change", updateServer);
  srvSel.addEventListener("change", updateServer);

  const update = () => {
    const lang = data.languages.find((l) => l.code === select.value)!;
    const s = sups[+slider.value];
    const useVar = check.checked;
    const emac = useVar ? s.variation : s.ideal;
    const cyc = useVar ? s.cycle_variation : s.cycle_ideal;
    voltText.textContent = `Supply voltage: ${s.v.toFixed(2)} V`;
    slider.setAttribute("aria-valuetext", `${s.v} volts`);

    const calc = (l: Lang) => {
      const E = l.macs * emac;
      return { E, N: E / (data.q * s.v) };
    };
    const a = calc(eng), b = calc(lang);
    const fill = (p: ReturnType<typeof panel>, l: Lang, c: { E: number; N: number }) => {
      p.rows.tokens.textContent = `${l.tokens.toFixed(1)}`;
      p.rows.macs.textContent = sci(l.macs, 3);
      p.rows.energy.textContent = joules(c.E);
      p.rows.electrons.textContent = sci(c.N, 2);
    };
    right.name.textContent = label(lang) + (lang.name ? "" : " (FLORES code)");
    fill(left, eng, a);
    fill(right, lang, b);

    const per = data.electrons_per_dot;
    const dotsA = Math.max(1, Math.round(a.N / per)), dotsB = Math.max(1, Math.round(b.N / per));
    const cols = 34;
    const rows = Math.ceil(Math.max(dotsA, dotsB) / cols);
    left.dots.draw(dotsA, cols, rows);
    right.dots.draw(dotsB, cols, rows);

    const ratioN = b.N / a.N;
    const slow = cyc / (useVar ? s18.cycle_variation : s18.cycle_ideal);
    const perMac = emac / (data.q * s.v);
    result.textContent =
      `${label(lang)} pulls ${ratioN.toFixed(2)}× the electrons of English for the same meaning ` +
      `(token ratio ${lang.ratio.toFixed(2)}×, 95% interval ${lang.lo.toFixed(2)} to ${lang.hi.toFixed(2)}). ` +
      `At ${s.v.toFixed(2)} V each multiply-add moves ${(perMac / 1e6).toFixed(2)} million electrons` +
      (s.v === 1.8 ? "." : ` and runs ${slow < 10 ? slow.toFixed(1) : Math.round(slow).toLocaleString("en")}× slower than at 1.8 V.`);
    formula.textContent =
      `N = M × E_MAC / (q V) = ${sci(lang.macs, 3)} × ${(emac * 1e15).toFixed(1)} fJ / (1.602 × 10⁻¹⁹ C × ${s.v.toFixed(2)} V) = ${sci(b.N, 2)} electrons`;
    legend.textContent = `Each dot is ${sci(per, 1)} electrons drawn from the supply. English: ${dotsA.toLocaleString("en")} dots. ${label(lang)}: ${dotsB.toLocaleString("en")} dots.`;
  };

  select.addEventListener("change", () => (mode === "chip" ? update : updateServer)());
  slider.addEventListener("input", update);
  check.addEventListener("change", update);
  setMode("chip");
}

for (const host of document.querySelectorAll<HTMLElement>("[data-electron-explorer]")) mount(host);
