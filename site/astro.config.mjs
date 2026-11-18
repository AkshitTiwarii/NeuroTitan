// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://neurotitan.in",
  // Vercel serves /about from /about/index.html; canonical URLs carry no trailing slash.
  trailingSlash: "never",
  build: {
    format: "directory",
    // External CSS only, so the Content-Security-Policy can stay strict.
    inlineStylesheets: "never",
  },
  // Never inline scripts into HTML: the Content-Security-Policy in vercel.json
  // allows only external scripts from our own origin ('self').
  vite: {
    build: { assetsInlineLimit: 0 },
  },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: "github-light" },
  },
});
