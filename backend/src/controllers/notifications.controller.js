const db = require('../db');

exports.list = async (req, res) =>
  res.json((await db.query(
    'SELECT id, message, type, link, is_read AS "isRead", created_at AS "createdAt" FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
    [req.user.id])).rows);

exports.unread = async (req, res) =>
  res.json({ count: (await db.query('SELECT COUNT(*)::int AS c FROM notifications WHERE user_id = $1 AND NOT is_read', [req.user.id])).rows[0].c });

exports.read = async (req, res) => {
  await db.query('UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.json({ ok: true });
};

exports.readAll = async (req, res) => {
  await db.query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [req.user.id]);
  res.json({ ok: true });
};
