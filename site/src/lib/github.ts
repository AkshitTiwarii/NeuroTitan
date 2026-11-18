/**
 * Numbers shown on the site that come from GitHub, fetched once at build time.
 * If the API is unreachable or rate-limited, the value is null and the page
 * shows a dash instead of a guess.
 */
import { SITE } from "../data/site";

export type OrgStats = { publicRepos: number | null; fetchedAt: string };

let cached: Promise<OrgStats> | undefined;

export function getOrgStats(): Promise<OrgStats> {
  cached ??= (async () => {
    const fetchedAt = new Date().toISOString().slice(0, 10);
    try {
      const res = await fetch(`https://api.github.com/orgs/${SITE.githubOrg}`, {
        headers: { Accept: "application/vnd.github+json", "User-Agent": "neurotitan-site-build" },
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) return { publicRepos: null, fetchedAt };
      const data = (await res.json()) as { public_repos?: number };
      return { publicRepos: typeof data.public_repos === "number" ? data.public_repos : null, fetchedAt };
    } catch {
      return { publicRepos: null, fetchedAt };
    }
  })();
  return cached;
}
