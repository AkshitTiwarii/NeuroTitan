/** Estimated reading time from the Markdown source: prose words at 230 per minute. */
export function readingMinutes(markdown: string | undefined): number {
  if (!markdown) return 1;
  const text = markdown
    .replace(/^---[\s\S]*?---/, " ") // front matter
    .replace(/```[\s\S]*?```/g, " ") // code blocks
    .replace(/\$\$[\s\S]*?\$\$/g, " ") // display maths
    .replace(/<[^>]+>/g, " ") // HTML tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\]\([^)]*\)/g, "]"); // link targets
  const words = text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  return Math.max(1, Math.round(words / 230));
}
