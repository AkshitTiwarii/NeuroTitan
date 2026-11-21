/**
 * Electron explorer for "What does a sentence cost in electrons?".
 * Mounts into any <div data-electron-explorer data-src="...json"> in a post.
 * All numbers come from the JSON, which is computed from the post's data files
 * (make_explorer_data.py); this script only does E = M * E_MAC and N = E / (qV).
 * Bundled as an external module (the CSP forbids inline scripts).
 */

type Supply = { v: number; ideal: number; variation: number; cycle_ideal: number; cycle_variation: number };
type Lang = { code: string; name: string | null; tokens: number; n: number; macs: number; ratio: number; lo: number; hi: number };
type Data = { q: number; m_lin: number; att_per_ctx: number; electrons_per_dot: number; supplies: Supply[]; languages: Lang[] };

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
  const intro = el("p", "ee-intro",
    "Pick a language and a supply voltage. The explorer counts the multiply-adds Qwen3-8B needs to read one average FLORES sentence, then the electrons a sky130 chip pulls from its supply to do them.");

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
  controls.append(langLabel, voltLabel, varLabel);

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

  host.append(title, intro, controls, panels, result, formula, legend, note);

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

  select.addEventListener("change", update);
  slider.addEventListener("input", update);
  check.addEventListener("change", update);
  update();
}

for (const host of document.querySelectorAll<HTMLElement>("[data-electron-explorer]")) mount(host);
