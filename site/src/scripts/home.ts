/*
 * Homepage motion (the hero figure lives in figure.ts). Everything here is decoration on top of content that is complete without it:
 * - with JavaScript off, the hero shows its first word and its figure caption, the statement is
 *   fully readable, and numbers show their real values;
 * - under prefers-reduced-motion, the figure draws one still frame and nothing moves;
 * - the figure pauses when off screen or when the tab is hidden.
 */

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => t * t * (3 - 2 * t);

/* ---------- 2. Hero: the last word scrambles into the next one ---------- */
function swapWords(el: HTMLElement) {
  const words: string[] = JSON.parse(el.dataset.words || "[]");
  if (reduce || words.length < 2) return;
  const glyphs = "01<>/=+*#%&";
  let i = 0;
  const to = (next: string) => {
    const from = el.textContent || "";
    const len = Math.max(from.length, next.length);
    const start = performance.now();
    const dur = 650;
    const step = (t: number) => {
      const k = clamp((t - start) / dur);
      let out = "";
      for (let j = 0; j < len; j++) {
        const settle = (j + 1) / len;
        if (k >= settle) out += next[j] ?? "";
        else if (k > settle - 0.45) out += glyphs[(Math.random() * glyphs.length) | 0];
        else out += from[j] ?? "";
      }
      el.textContent = out;
      if (k < 1) requestAnimationFrame(step);
      else el.textContent = next;
    };
    requestAnimationFrame(step);
  };
  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    i = (i + 1) % words.length;
    to(words[i]);
  }, 2800);
}

/* ---------- 3. Statement: words light up as you scroll through it ---------- */
function statement(section: HTMLElement) {
  const words = Array.from(section.querySelectorAll<HTMLElement>(".w"));
  if (reduce || !words.length) return;
  section.classList.add("is-live");
  const update = () => {
    const b = section.getBoundingClientRect();
    const total = b.height - innerHeight;
    const p = clamp((-b.top + innerHeight * 0.1) / (total * 0.85 || 1));
    const lit = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < lit));
  };
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  };
  update();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
}

/* ---------- 4. Numbers count up when they come into view ---------- */
function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target) || reduce) return;
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    const start = performance.now();
    const dur = 1100;
    const step = (t: number) => {
      const k = clamp((t - start) / dur);
      el.textContent = String(Math.round(target * ease(k)));
      if (k < 1) requestAnimationFrame(step);
    };
    el.textContent = "0";
    requestAnimationFrame(step);
  });
  io.observe(el);
}

document.querySelectorAll<HTMLElement>("[data-words]").forEach(swapWords);
document.querySelectorAll<HTMLElement>("[data-statement]").forEach(statement);
document.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
import "./figure";
