// Read-back from Supabase: numbers shown on the page
const SB_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;

module.exports = async (req, res) => {
  try {
    const h = { apikey: SB_KEY };
    if (SB_KEY && SB_KEY.startsWith("eyJ")) h.Authorization = `Bearer ${SB_KEY}`;
    const r = await fetch(`${SB_URL}/rest/v1/xray_stats?select=*`, { headers: h });
    if (!r.ok) throw new Error(await r.text());
    const [row] = await r.json();
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      plans: Number(row?.plans || 0),
      interestUncovered: Number(row?.interest_uncovered || 0),
      avgSaved: Number(row?.avg_saved || 0),
    });
  } catch (e) {
    console.error(e);
    return res.status(200).json({ plans: 0, interestUncovered: 0, avgSaved: 0, error: true });
  }
};
