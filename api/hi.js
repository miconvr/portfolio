const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const KEY = "been-here";

async function redis(cmd) {
  const r = await fetch(`${URL_}/${cmd}/${KEY}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!r.ok) throw new Error("redis " + r.status);
  const d = await r.json();
  return Number(d.result) || 0;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (!URL_ || !TOKEN) throw new Error("missing env vars");
    const count = await redis(req.method === "POST" ? "incr" : "get");
    res.status(200).json({ count });
  } catch (e) {
    res.status(500).json({ error: "counter unavailable" });
  }
};
