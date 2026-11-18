import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Blog posts. One Markdown file per post in src/content/blog/.
 * The lab's rule is that every post ships with original proof, so `repo`
 * (the public code and data behind the post) is required unless the post is
 * an analysis with no code, in which case set `repo: null` on purpose.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().max(90),
    description: z.string().min(50).max(160),
    field: z.enum(["AI", "Semiconductors", "Quantum"]),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    authors: z.array(z.string()).min(1),
    repo: z.string().url().nullable(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
