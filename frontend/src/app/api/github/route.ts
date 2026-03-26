export const revalidate = 3600; // ISR: refresh every hour

export async function GET() {
  try {
    const headers = { Accept: "application/vnd.github.v3+json" };

    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/Anshmodi03", {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(
        "https://api.github.com/users/Anshmodi03/repos?per_page=100&sort=stars",
        { headers, next: { revalidate: 3600 } }
      ),
    ]);

    const user  = await userRes.json();
    const repos = await reposRes.json();

    if (!Array.isArray(repos)) throw new Error("repos not array");

    const totalStars = repos.reduce(
      (s: number, r: { stargazers_count: number }) => s + (r.stargazers_count ?? 0),
      0
    );

    const langMap: Record<string, number> = {};
    repos.forEach((r: { language: string | null }) => {
      if (r.language) langMap[r.language] = (langMap[r.language] ?? 0) + 1;
    });

    const totalWithLang = repos.filter((r: { language: string | null }) => r.language).length;
    const languages = Object.entries(langMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        pct: Math.round((count / (totalWithLang || 1)) * 100),
      }));

    return Response.json({
      repos:     user.public_repos ?? 0,
      followers: user.followers    ?? 0,
      stars:     totalStars,
      languages,
    });
  } catch {
    return Response.json({
      repos: 50,
      followers: 1,
      stars: 0,
      languages: [
        { name: "JavaScript", pct: 75 },
        { name: "CSS",        pct: 13 },
        { name: "TypeScript", pct: 6  },
        { name: "HTML",       pct: 6  },
      ],
    });
  }
}
