const db = require('../db');

const iso = (d) => d.toISOString().slice(0, 10);

exports.stats = async (req, res) => {
  const today = new Date(), start = new Date(Date.now() - 29 * 864e5);
  const from = req.query.from || '1970-01-01', to = req.query.to || '2999-12-31';
  const tFrom = req.query.from || iso(start), tTo = req.query.to || iso(today);
  const q = async (sql, p = []) => (await db.query(sql, p)).rows;
  const range = 'created_at::date BETWEEN $1 AND $2';

  const [t] = await q(`SELECT COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE type = 'lost')::int AS lost,
      COUNT(*) FILTER (WHERE type = 'found')::int AS found,
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE status IN ('approved','claimed','returned'))::int AS published,
      COUNT(*) FILTER (WHERE status = 'returned')::int AS returned
    FROM items WHERE ${range}`, [from, to]);
  t.returnRate = t.found ? Math.round((t.returned * 100) / t.found) : 0;

  const [{ c: pendingClaims }] = await q("SELECT COUNT(*)::int AS c FROM claims WHERE status = 'pending'");
  const categories = await q(`SELECT category, COUNT(*)::int AS count FROM items WHERE ${range} GROUP BY category ORDER BY count DESC LIMIT 6`, [from, to]);
  const trend = await q(`SELECT to_char(d, 'Mon DD') AS label,
      COUNT(i.id) FILTER (WHERE i.type = 'lost')::int AS lost, COUNT(i.id) FILTER (WHERE i.type = 'found')::int AS found
    FROM generate_series($1::date::timestamp, $2::date::timestamp, interval '1 day') d
    LEFT JOIN items i ON i.created_at::date = d::date GROUP BY d ORDER BY d`, [tFrom, tTo]);
  const recentItems = await q('SELECT id, title, type, status, created_at AS "createdAt" FROM items ORDER BY created_at DESC LIMIT 5');
  const waitingClaims = await q(`SELECT c.id, i.title, u.name AS "claimantName", c.created_at AS "createdAt"
    FROM claims c JOIN items i ON i.id = c.item_id JOIN users u ON u.id = c.claimant_id
    WHERE c.status = 'pending' ORDER BY c.created_at DESC LIMIT 4`);
  res.json({ totals: t, pendingClaims, categories, trend, recentItems, waitingClaims });
};
