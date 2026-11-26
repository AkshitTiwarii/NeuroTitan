// Language Cost Index v0 as CSV, one row per language and tokenizer. Same data as index-v0.json.
import type { APIRoute } from "astro";
import index from "../../data/language-index.json";

const q = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

export const GET: APIRoute = () => {
  const rows = ["lang_code,language,tokenizer,ratio_to_english,ratio_lo95,ratio_hi95"];
  for (const l of index.languages) {
    index.tokenizers.forEach((t, i) => {
      const [r, lo, hi] = l.r[i];
      rows.push([l.c, q(l.n), t.id, r, lo, hi].join(","));
    });
  }
  return new Response(rows.join("\n") + "\n", {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  });
};
