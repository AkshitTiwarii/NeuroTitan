/*
 * Live blog counters: views, measured reading time and reactions.
 * - Counters only. No cookies, no IP addresses, no identifiers are sent or stored.
 * - The browser remembers its own reaction and last view date in localStorage, so a reader
 *   counts as one view per post per day and can hold one reaction per post.
 * - Views and reading time are not sent if the browser sends Do Not Track or Global Privacy Control.
 * Without JavaScript, or if the counter service is down, the page shows only the estimated read time.
 */
import { STATS, REACTIONS } from "../data/stats";

type Row = { slug: string; views: number; read_seconds: number; read_samples: number; reactions: Record<string, number> };
const KINDS = REACTIONS.map((r) => r.kind as string);
const nf = new Intl.NumberFormat("en-GB");
const dnt =
  navigator.doNotTrack === "1" ||
  (window as unknown as { doNotTrack?: string }).doNotTrack === "1" ||
  (navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

async function rpc<T = unknown>(fn: string, args: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(`${STATS.url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { apikey: STATS.key, "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    if (!res.ok) return null;
    const text = await res.text();
    return (text ? JSON.parse(text) : null) as T;
  } catch {
    return null;
  }
}

function load(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function save(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage blocked: counters still work, the browser just will not remember */
  }
}

const plural = (n: number, one: string, many: string) => `${nf.format(n)} ${n === 1 ? one : many}`;
const total = (r: Record<string, number>) => KINDS.reduce((s, k) => s + (r[k] ?? 0), 0);

function show(root: ParentNode, name: string, text: string | null) {
  if (text === null) return;
  root.querySelectorAll<HTMLElement>(`[data-stat="${name}"]`).forEach((el) => {
    const out = el.querySelector<HTMLElement>("[data-stat-text]") ?? el;
    out.textContent = text;
    el.hidden = false;
  });
}

function paint(row: Row) {
  document.querySelectorAll<HTMLElement>(`[data-stats-slug="${row.slug}"]`).forEach((root) => {
    show(root, "views", plural(row.views, "view", "views"));
    const avg = row.read_samples >= STATS.minReadSamples ? Math.round(row.read_seconds / row.read_samples / 60) : null;
    show(root, "avgread", avg === null ? null : `avg. ${Math.max(1, avg)} min spent reading`);
    const t = total(row.reactions);
    show(root, "reactions", t > 0 ? plural(t, "reaction", "reactions") : null);
  });
}

// ---- reactions bar (post pages) ----
function setupReactions(bar: HTMLElement, slug: string, counts: Record<string, number>) {
  const key = `nt-react:${slug}`;
  let mine = load(key);
  if (mine && !KINDS.includes(mine)) mine = null;
  const buttons = Array.from(bar.querySelectorAll<HTMLButtonElement>("button[data-kind]"));
  const render = () => {
    for (const b of buttons) {
      const k = b.dataset.kind!;
      const n = counts[k] ?? 0;
      b.setAttribute("aria-pressed", String(mine === k));
      const c = b.querySelector<HTMLElement>("[data-count]");
      if (c) c.textContent = n > 0 ? nf.format(n) : "";
    }
    const t = total(counts);
    const sum = bar.querySelector<HTMLElement>("[data-total]");
    if (sum) sum.textContent = t > 0 ? plural(t, "reaction", "reactions") : "Be the first to react.";
  };
  render();
  bar.hidden = false;
  let busy = false;
  for (const b of buttons) {
    b.addEventListener("click", async () => {
      if (busy) return;
      busy = true;
      const k = b.dataset.kind!;
      const prev = mine;
      if (prev) counts[prev] = Math.max(0, (counts[prev] ?? 0) - 1);
      mine = prev === k ? null : k;
      if (mine) counts[mine] = (counts[mine] ?? 0) + 1;
      save(key, mine);
      render();
      if (prev) await rpc("blog_react", { p_slug: slug, p_kind: prev, p_delta: -1 });
      if (mine) await rpc("blog_react", { p_slug: slug, p_kind: mine, p_delta: 1 });
      busy = false;
    });
  }
}

// ---- one view per post per day ----
function countView(slug: string) {
  if (dnt) return;
  const key = `nt-view:${slug}`;
  const today = new Date().toISOString().slice(0, 10);
  if (load(key) === today) return;
  save(key, today);
  void rpc("blog_view", { p_slug: slug });
}

// ---- measured reading time: only while the tab is visible and the reader was active in the last minute ----
function measureReading(slug: string) {
  if (dnt) return;
  const SLICE = 30;
  const MAX = 60 * 60;
  let last = Date.now();
  let pending = 0;
  let sent = 0;
  let first = true;
  const active = () => {
    last = Date.now();
  };
  for (const ev of ["scroll", "keydown", "pointerdown", "pointermove", "touchstart", "wheel"]) {
    addEventListener(ev, active, { passive: true });
  }
  const timer = setInterval(() => {
    if (document.visibilityState !== "visible" || Date.now() - last > 60_000) return;
    pending += 1;
    if (pending >= SLICE) {
      void rpc("blog_read", { p_slug: slug, p_seconds: pending, p_first: first });
      sent += pending;
      pending = 0;
      first = false;
      if (sent >= MAX) clearInterval(timer);
    }
  }, 1000);
}

async function main() {
  const roots = Array.from(document.querySelectorAll<HTMLElement>("[data-stats-slug]"));
  const slugs = Array.from(new Set(roots.map((r) => r.dataset.statsSlug!)));
  const post = document.querySelector<HTMLElement>("[data-post-slug]")?.dataset.postSlug;
  if (post) {
    countView(post);
    measureReading(post);
  }
  if (!slugs.length) return;
  const rows = await rpc<Row[]>("blog_stats", { p_slugs: slugs });
  if (!rows) return; // service unavailable: leave the static read time only
  for (const row of rows) paint(row);
  const bar = document.querySelector<HTMLElement>("[data-reactions]");
  if (bar && post) {
    const row = rows.find((r) => r.slug === post);
    setupReactions(bar, post, { ...(row?.reactions ?? {}) });
  }
}

void main();
