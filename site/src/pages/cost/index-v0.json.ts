// Language Cost Index v0 as JSON: free, no key. Rebuilt by site/scripts/make_language_index.py.
import type { APIRoute } from "astro";
import index from "../../data/language-index.json";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
