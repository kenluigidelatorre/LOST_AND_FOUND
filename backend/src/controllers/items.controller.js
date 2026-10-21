const fs = require('fs');
const db = require('../db');
const { notify, notifyAdmins } = require('../notify');

const CATEGORIES = ['ID / Documents', 'Bags', 'Electronics', 'Accessories', 'Clothing', 'Others'];
const SELECT = `SELECT i.id, i.type, i.title, i.category, i.description, i.location, i.date_event AS date, i.image,
  i.status, i.reject_reason AS "rejectReason", i.reported_by AS "reportedBy", i.created_at AS "createdAt",
  u.name AS "reporterName", u.student_id AS "reporterStudentId"
  FROM items i JOIN users u ON u.id = i.reported_by`;

// small helper to build WHERE clauses safely (values are always parameters)
const where = (base) => {
  const w = [base], p = [];
  return { p, add: (sql, v) => { p.push(v); w.push(sql.replaceAll('?', '$' + p.length)); }, sql: () => w.join(' AND ') };
};

exports.list = async (req, res) => {
  const { q, type, category, location, days } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1), limit = 12;
  const f = where("i.status = 'approved'");
  if (type) f.add('i.type = ?', type);
  if (category) f.add('i.category = ?', category);
  if (location) f.add('i.location = ?', location);
  if (days) f.add('i.date_event >= CURRENT_DATE - (?::int)', days);
  if (q) f.add('(i.title ILIKE ? OR i.description ILIKE ?)', `%${q}%`);
  const total = (await db.query(`SELECT COUNT(*)::int AS c FROM items i WHERE ${f.sql()}`, f.p)).rows[0].c;
  const { rows } = await db.query(`${SELECT} WHERE ${f.sql()} ORDER BY i.created_at DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`, f.p);
  res.json({ items: rows, total, page, pages: Math.ceil(total / limit) || 1 });
};

exports.recent = async (req, res) =>
  res.json((await db.query(`${SELECT} WHERE i.status = 'approved' ORDER BY i.created_at DESC LIMIT 4`)).rows);

exports.locations = async (req, res) =>
  res.json((await db.query("SELECT DISTINCT location FROM items WHERE status = 'approved' ORDER BY 1")).rows.map((r) => r.location));

exports.mine = async (req, res) =>
  res.json((await db.query(`${SELECT} WHERE i.reported_by = $1 ORDER BY i.created_at DESC`, [req.user.id])).rows);

exports.getOne = async (req, res) => {
  const { rows } = await db.query(`${SELECT} WHERE i.id = $1`, [req.params.id]);
  const item = rows[0], u = req.user;
  let ok = item && (item.status === 'approved' || u?.role === 'admin' || u?.id === item.reportedBy);
  if (item && !ok && u) ok = (await db.query('SELECT 1 FROM claims WHERE item_id = $1 AND claimant_id = $2', [item.id, u.id])).rowCount > 0;
  if (!ok) return res.status(404).json({ message: 'Item not found' });
  const similar = (await db.query(`${SELECT} WHERE i.status = 'approved' AND i.category = $1 AND i.id <> $2 ORDER BY i.created_at DESC LIMIT 4`, [item.category, item.id])).rows;
  let myClaim = null;
  if (u) myClaim = (await db.query('SELECT id, status FROM claims WHERE item_id = $1 AND claimant_id = $2', [item.id, u.id])).rows[0] || null;
  res.json({ ...item, similar, myClaim });
};

exports.create = async (req, res) => {
  const { type, title, category, description, location, date } = req.body;
  const bad = (message) => { if (req.file) fs.unlink(req.file.path, () => {}); return res.status(400).json({ message }); };
  if (!['lost', 'found'].includes(type) || ![title, category, description, location, date].every((v) => v && String(v).trim()))
    return bad('Please complete all required fields');
  if (!CATEGORIES.includes(category)) return bad('Please choose a valid category');
  if (isNaN(Date.parse(date))) return bad('Please enter a valid date');
  const { rows } = await db.query(
    `INSERT INTO items (type, title, category, description, location, date_event, image, reported_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, status`,
    [type, title.trim(), category, description.trim(), location.trim(), date, req.file ? '/uploads/' + req.file.filename : null, req.user.id]);
  await notifyAdmins(`New ${type} report: "${title.trim()}" is waiting for review.`, 'report', '/admin/reports');
  res.status(201).json(rows[0]);
};

// ---- admin ----
exports.adminList = async (req, res) => {
  const { status, type, q } = req.query;
  const f = where('TRUE');
  if (status) f.add('i.status = ?', status);
  if (type) f.add('i.type = ?', type);
  if (q) f.add('(i.title ILIKE ? OR u.name ILIKE ?)', `%${q}%`);
  res.json((await db.query(`${SELECT} WHERE ${f.sql()} ORDER BY i.created_at DESC LIMIT 200`, f.p)).rows);
};

exports.review = async (req, res) => {
  const { decision, reason } = req.body;
  if (!['approved', 'rejected'].includes(decision)) return res.status(400).json({ message: 'Invalid decision' });
  if (decision === 'rejected' && !reason?.trim()) return res.status(400).json({ message: 'A reason is required when rejecting a report' });
  const { rows } = await db.query(
    "UPDATE items SET status = $1, reject_reason = $2 WHERE id = $3 AND status = 'pending' RETURNING id, title, type, reported_by",
    [decision, decision === 'rejected' ? reason.trim() : null, req.params.id]);
  if (!rows[0]) return res.status(409).json({ message: 'Report not found or already reviewed' });
  const it = rows[0];
  await notify(it.reported_by,
    decision === 'approved' ? `Your ${it.type} report "${it.title}" was approved and is now published.`
      : `Your report "${it.title}" was rejected. Reason: ${reason.trim()}`,
    decision === 'approved' ? 'approved' : 'rejected', `/items/${it.id}`);
  res.json({ ok: true });
};
