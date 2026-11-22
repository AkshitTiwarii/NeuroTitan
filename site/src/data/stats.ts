/**
 * Live blog counters (views, reading time, reactions), stored in Supabase.
 * The publishable key is meant to be public: it can only call the four
 * blog_* functions in supabase/migrations/20261122_blog_stats.sql.
 */
export const STATS = {
  url: "https://migswpcyqacltkcdridr.supabase.co",
  key: "sb_publishable_KE5rSelCyisvCyttY1JcZQ_8krck1IS",
  /** Average reading time is shown only once this many reading sessions exist. */
  minReadSamples: 5,
} as const;

export const REACTIONS = [
  { kind: "like", emoji: "👍", label: "Like" },
  { kind: "love", emoji: "❤️", label: "Love" },
  { kind: "celebrate", emoji: "👏", label: "Celebrate" },
  { kind: "support", emoji: "🤝", label: "Support" },
  { kind: "insightful", emoji: "💡", label: "Insightful" },
] as const;
