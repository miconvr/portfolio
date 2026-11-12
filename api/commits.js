const OWNER = "miconvr";
const REPOS = ["kaltas", "civicguard"];
const TOKEN = process.env.GITHUB_TOKEN;

async function countCommits(repo) {
  const r = await fetch(
    `https://api.github.com/repos/${OWNER}/${repo}/commits?per_page=1`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "miconvr-portfolio",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
    }
  );
  if (!r.ok) throw new Error("github " + r.status);
  const last = /[?&]page=(\d+)>; rel="last"/.exec(r.headers.get("link") || "");
  if (last) return Number(last[1]);
  const list = await r.json();
  return Array.isArray(list) ? list.length : 0;
}

module.exports = async (req, res) => {
  try {
    const counts = await Promise.all(REPOS.map(countCommits));
    const total = counts.reduce((a, b) => a + b, 0);
    const step = total >= 1000 ? 100 : 50;
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({ commits: Math.floor(total / step) * step });
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ error: "commits unavailable" });
  }
};
