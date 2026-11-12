const OWNER = "miconvr";
const TOKEN = process.env.GITHUB_TOKEN;
const PROJECTS = { kaltas: "kaltas", civicguard: "civicguard" };

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "miconvr-portfolio",
  Authorization: `Bearer ${TOKEN}`,
};

async function gql(query) {
  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({ query }),
  });
  if (!r.ok) throw new Error("graphql " + r.status);
  const j = await r.json();
  if (j.errors) throw new Error("graphql query error");
  return j.data;
}

async function totalCommits() {
  const { user } = await gql(`{ user(login:"${OWNER}"){ createdAt } }`);
  const startYear = new Date(user.createdAt).getUTCFullYear();
  const nowYear = new Date().getUTCFullYear();
  let fields = "";
  for (let y = startYear; y <= nowYear; y++) {
    fields += `y${y}: contributionsCollection(from:"${y}-01-01T00:00:00Z", to:"${y}-12-31T23:59:59Z"){
      totalCommitContributions restrictedContributionsCount }`;
  }
  const data = await gql(`{ user(login:"${OWNER}"){ ${fields} } }`);
  return Object.values(data.user).reduce(
    (sum, c) => sum + c.totalCommitContributions + c.restrictedContributionsCount, 0
  );
}

async function repoCommits(repo) {
  const r = await fetch(
    `https://api.github.com/repos/${OWNER}/${repo}/commits?per_page=1`,
    { headers }
  );
  if (!r.ok) throw new Error("github " + r.status);
  const last = /[?&]page=(\d+)>; rel="last"/.exec(r.headers.get("link") || "");
  if (last) return Number(last[1]);
  const list = await r.json();
  return Array.isArray(list) ? list.length : 0;
}

const round = (n) => Math.floor(n / 10) * 10;

module.exports = async (req, res) => {
  try {
    const [total, ...per] = await Promise.all([
      totalCommits(),
      ...Object.values(PROJECTS).map(repoCommits),
    ]);
    const out = { commits: round(total) };
    Object.keys(PROJECTS).forEach((k, i) => (out[k] = round(per[i])));
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json(out);
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ error: "commits unavailable" });
  }
};
