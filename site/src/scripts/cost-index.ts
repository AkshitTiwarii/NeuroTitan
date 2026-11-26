/**
 * Language Cost Index page (/cost): the language-tax calculator, the paste-your-text token counter,
 * and sorting and filtering for the full table. The tokenizers for the paste box are loaded only when
 * asked for, from our own site (strict CSP), and the pasted text never leaves the browser.
 */
import index from "../data/language-index.json";

type Lang = (typeof index.languages)[number];

const langs = index.languages as Lang[];
const toks = index.tokenizers;
const byCode = new Map(langs.map((l) => [l.c, l]));
const fmt = (x: number) => x.toFixed(2);
const usd = (x: number) =>
  x.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const el = <T extends HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);

/* ---------- 01: calculator ---------- */

const tool = el<HTMLElement>("[data-cost-tool]");
const langSel = el<HTMLSelectElement>("[data-lang]");
const tokSel = el<HTMLSelectElement>("[data-tok]");
const spendIn = el<HTMLInputElement>("[data-spend]");

function renderTool() {
  if (!tool || !langSel || !tokSel || !spendIn) return;
  const lang = byCode.get(langSel.value);
  if (!lang) return;
  const ti = Number(tokSel.value);
  const [r, lo, hi] = lang.r[ti];
  const spend = Math.max(0, Number(spendIn.value) || 0);
  const tax = spend * (1 - 1 / r);
  const tok = toks[ti];

  el("[data-out-ratio]", tool)!.textContent = fmt(r);
  const text = el("[data-out-text]", tool)!;
  if (r > 1) {
    text.textContent = `On ${tok.label} (${tok.models}), ${lang.n} needs ${fmt(r)}× the tokens of English for the same meaning (95% interval ${fmt(lo)} to ${fmt(hi)}). Of ${usd(spend)} a month, about ${usd(tax)} pays for tokens English would not need.`;
  } else {
    text.textContent = `On ${tok.label} (${tok.models}), ${lang.n} needs ${fmt(r)}× English's tokens: no extra cost against English on this tokenizer.`;
  }

  // Cheapest tokenizer for this language, among current API tokenizers and among all eight.
  const order = lang.r.map((x, i) => ({ i, r: x[0] })).sort((a, b) => a.r - b.r);
  const best = order[0];
  const bestText = el("[data-out-best]", tool)!;
  bestText.textContent =
    best.i === ti
      ? `${tok.label} is already the most efficient of the ${toks.length} tokenizers we measured for ${lang.n}.`
      : `Most efficient of the ${toks.length} for ${lang.n}: ${toks[best.i].label} at ${fmt(best.r)}×. Fewer tokens is not the same as a cheaper or better model; prices and quality differ, which is what an audit checks.`;

  // Bars: every tokenizer for this language, on a shared scale.
  const max = Math.max(...lang.r.map((x) => x[2]), 1.05);
  const bars = el("[data-bars]", tool)!;
  bars.replaceChildren(
    ...lang.r.map((x, i) => {
      const row = document.createElement("div");
      row.className = `bar${i === ti ? " is-on" : ""}`;
      const name = document.createElement("span");
      name.textContent = toks[i].label;
      const track = document.createElement("span");
      track.className = "track";
      const fill = document.createElement("span");
      fill.className = "fill";
      fill.style.width = `${(x[0] / max) * 100}%`;
      const ci = document.createElement("span");
      ci.className = "ci";
      ci.style.left = `${(x[1] / max) * 100}%`;
      ci.style.width = `${Math.max(0, ((x[2] - x[1]) / max) * 100)}%`;
      const one = document.createElement("span");
      one.className = "one";
      one.style.left = `${(1 / max) * 100}%`;
      one.title = "English = 1";
      track.append(fill, ci, one);
      const v = document.createElement("span");
      v.className = "v";
      v.textContent = `${fmt(x[0])}×`;
      row.append(name, track, v);
      return row;
    }),
  );
}

[langSel, tokSel, spendIn].forEach((x) => x?.addEventListener("input", () => (renderTool(), renderPaste())));
renderTool();

/* ---------- 02: paste your own text ---------- */

type Enc = { encode: (s: string) => number[] };
let encoders: Promise<{ o200k: Enc; cl100k: Enc }> | null = null;

function loadEncoders() {
  encoders ??= (async () => {
    const [{ Tiktoken }, o, c] = await Promise.all([
      import("js-tiktoken/lite"),
      import("js-tiktoken/ranks/o200k_base"),
      import("js-tiktoken/ranks/cl100k_base"),
    ]);
    return { o200k: new Tiktoken(o.default), cl100k: new Tiktoken(c.default) };
  })();
  return encoders;
}

const paste = el<HTMLElement>("[data-paste]");
let lastCounts: { o200k: number; cl100k: number; chars: number; bytes: number } | null = null;

function renderPaste() {
  if (!paste || !lastCounts || !langSel) return;
  const lang = byCode.get(langSel.value)!;
  const out = el<HTMLTableElement>("[data-paste-out]", paste)!;
  const note = el<HTMLElement>("[data-paste-note]", paste)!;
  const rows: [string, number, number][] = [
    ["OpenAI o200k (GPT-4o, GPT-4.1, GPT-5)", lastCounts.o200k, lang.r[toks.findIndex((t) => t.id === "o200k")][0]],
    ["OpenAI cl100k (GPT-4)", lastCounts.cl100k, lang.r[toks.findIndex((t) => t.id === "cl100k")][0]],
  ];
  out.tBodies[0].replaceChildren(
    ...rows.map(([name, n, r]) => {
      const tr = document.createElement("tr");
      const eng = Math.round(n / r);
      for (const v of [name, n.toLocaleString("en-US"), eng.toLocaleString("en-US"), (n - eng).toLocaleString("en-US")]) {
        const td = document.createElement("td");
        td.textContent = v;
        tr.append(td);
      }
      return tr;
    }),
  );
  out.hidden = false;
  note.hidden = false;
  note.textContent = `${lastCounts.chars.toLocaleString("en-US")} characters, ${lastCounts.bytes.toLocaleString("en-US")} UTF-8 bytes. The English estimate assumes the text is ${lang.n} (change it in section 01) and divides by that language's measured ratio. It is an average over 1,012 sentences, so a single short text can differ.`;
}

if (paste) {
  const btn = el<HTMLButtonElement>("[data-count]", paste)!;
  const status = el<HTMLElement>("[data-paste-status]", paste)!;
  const text = el<HTMLTextAreaElement>("[data-text]", paste)!;
  btn.addEventListener("click", async () => {
    const s = text.value;
    if (!s.trim()) {
      status.textContent = "Paste some text first.";
      return;
    }
    btn.disabled = true;
    status.textContent = "Loading tokenizers…";
    try {
      const enc = await loadEncoders();
      lastCounts = {
        o200k: enc.o200k.encode(s).length,
        cl100k: enc.cl100k.encode(s).length,
        chars: [...s].length,
        bytes: new TextEncoder().encode(s).length,
      };
      status.textContent = "Counted in your browser.";
      renderPaste();
    } catch {
      status.textContent = "The tokenizers did not load. Please reload the page and try again.";
    } finally {
      btn.disabled = false;
    }
  });
}

/* ---------- 03: sort and filter the full table ---------- */

const table = el<HTMLTableElement>("[data-index]");
if (table) {
  const body = table.tBodies[0];
  const rows = [...body.rows];
  const heads = [...table.tHead!.rows[0].cells];

  heads.forEach((th, col) => {
    th.tabIndex = 0;
    const sort = () => {
      const asc = th.getAttribute("aria-sort") !== "ascending";
      heads.forEach((h) => h.removeAttribute("aria-sort"));
      th.setAttribute("aria-sort", asc ? "ascending" : "descending");
      const key = (tr: HTMLTableRowElement) => {
        if (col === 0) return tr.dataset.n ?? "";
        const v = (tr.cells[col] as HTMLElement).dataset.v;
        return v === "" || v === undefined ? NaN : Number(v);
      };
      rows.sort((a, b) => {
        const x = key(a);
        const y = key(b);
        if (typeof x === "string" || typeof y === "string") return asc ? String(x).localeCompare(String(y)) : String(y).localeCompare(String(x));
        // Missing values always go last.
        if (Number.isNaN(x)) return 1;
        if (Number.isNaN(y)) return -1;
        return asc ? x - y : y - x;
      });
      body.append(...rows);
    };
    th.addEventListener("click", sort);
    th.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        sort();
      }
    });
  });

  const filter = el<HTMLInputElement>("[data-filter]");
  filter?.addEventListener("input", () => {
    const f = filter.value.trim().toLowerCase();
    for (const tr of rows) tr.hidden = !!f && !(tr.dataset.n!.includes(f) || tr.dataset.c!.toLowerCase().includes(f));
  });
}
