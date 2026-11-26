// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

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
    // Maths typeset at build time: posts ship static HTML plus MathML for screen readers,
    // no maths script runs in the browser. KaTeX's CSS and fonts are bundled from npm (font-src 'self').
    // Astro 7 defaults to the Satteri processor. remark-math and rehype-katex are unified
    // plugins, so the blog keeps the unified processor from @astrojs/markdown-remark.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { output: "htmlAndMathml", throwOnError: true }]],
    }),
  },
});
