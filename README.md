# neurotitan.in

The website of NeuroTitan Labs: a static site built with [Astro](https://astro.build) and deployed on Vercel.

## Run it

```bash
cd site
npm ci
npm run dev        # http://localhost:4321
npm run build      # type-checks, then writes static HTML to site/dist
npm run preview    # serves site/dist
```

Node 20.3 or newer.

## Layout

| Path | What it is |
|---|---|
| `site/src/pages/` | One file per route: `/`, `/research`, `/blog`, `/blog/<slug>`, `/about`, `/privacy`, `404`, `rss.xml`, `robots.txt` |
| `site/src/content/blog/` | Blog posts, one Markdown file each (see below) |
| `site/src/data/site.ts` | Site facts: fields, people, projects, contact. Every line must be true and checkable |
| `site/src/styles/global.css` | Design tokens (paper, ink, grey, one red accent) and base styles |
| `site/public/analytics.js` | GA4 and PostHog, loaded after page load, session recording off, skipped under Do Not Track / GPC |
| `site/scripts/make_images.py` | Regenerates favicon.ico, apple-touch-icon.png and og-default.png |
| `vercel.json` | Build settings, security headers, the `/semiconductor` redirect |

## Adding a blog post

Create `site/src/content/blog/<slug>.md`:

```markdown
---
title: "Under 90 characters"
description: "50 to 160 characters. Used for search results and link previews."
field: AI            # AI | Semiconductors | Quantum
date: 2026-11-28
authors: ["Name One", "Name Two"]
repo: https://github.com/NeuroTitan-Hub/<repo>   # code and data behind the post; null only on purpose
draft: true          # drafts show in `npm run dev`, never in a build
---

Post body in Markdown.
```

The build fails if the frontmatter breaks these rules. Each post gets its own title, description, canonical URL, Open Graph tags and JSON-LD, and appears in `/rss.xml` and the sitemap.

## Deploys

Vercel builds every push. Pull requests get a preview URL; merging to `main` deploys to neurotitan.in. Changes reach `main` only through a reviewed pull request.
