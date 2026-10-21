const db = require('../db');
const { notify, notifyAdmins } = require('../notify');

const SEL = `SELECT c.id, c.status, c.proof, c.admin_note AS "adminNote", c.created_at AS "createdAt", c.returned_at AS "returnedAt",
  i.id AS "itemId", i.title, i.type AS "itemType", i.image, i.location, i.date_event AS "itemDate",
  i.description AS "itemDescription", i.status AS "itemStatus",
  u.id AS "claimantId", u.name AS "claimantName", u.student_id AS "claimantStudentId", u.email AS "claimantEmail"
  FROM claims c JOIN items i ON i.id = c.item_id JOIN users u ON u.id = c.claimant_id`;

exports.create = async (req, res) => {
  const { itemId, proof } = req.body;
  if (!proof?.trim()) return res.status(400).json({ message: 'Please describe your proof of ownership' });
  const { rows: [item] } = await db.query('SELECT * FROM items WHERE id = $1', [itemId]);
  if (!item || item.status !== 'approved' || item.type !== 'found') return res.status(400).json({ message: 'This item cannot be claimed' });
  if (item.reported_by === req.user.id) return res.status(400).json({ message: 'You cannot claim your own report' });
  if ((await db.query('SELECT 1 FROM claims WHERE item_id = $1 AND claimant_id = $2', [itemId, req.user.id])).rowCount)
    return res.status(409).json({ message: 'You already submitted a claim for this item' });
  const { rows: [c] } = await db.query('INSERT INTO claims (item_id, claimant_id, proof) VALUES ($1,$2,$3) RETURNING id', [itemId, req.user.id, proof.trim()]);
  await notifyAdmins(`New claim submitted for "${item.title}".`, 'claim', `/admin/claims/${c.id}`);
  res.status(201).json({ id: c.id });
};

exports.mine = async (req, res) =>
  res.json((await db.query(`${SEL} WHERE c.claimant_id = $1 ORDER BY c.created_at DESC`, [req.user.id])).rows);

exports.adminList = async (req, res) => {
  const { status } = req.query;
  res.json((await db.query(`${SEL} ${status ? 'WHERE c.status = $1' : ''} ORDER BY c.created_at DESC LIMIT 200`, status ? [status] : [])).rows);
};

exports.adminGet = async (req, res) => {
  const { rows } = await db.query(`${SEL} WHERE c.id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Claim not found' });
  res.json(rows[0]);
};

exports.decide = async (req, res) => {
  const { decision, note } = req.body;
  if (!['approved', 'rejected'].includes(decision)) return res.status(400).json({ message: 'Invalid decision' });
  if (decision === 'rejected' && !note?.trim()) return res.status(400).json({ message: 'Please give a reason for rejecting this claim' });
  const done = await db.tx(async (cx) => {
    const { rows: [c] } = await cx.query(
      "UPDATE claims SET status = $1, admin_note = $2, reviewed_by = $3 WHERE id = $4 AND status = 'pending' RETURNING *",
      [decision, note?.trim() || null, req.user.id, req.params.id]);
    if (!c) return null;
    const { rows: [item] } = await cx.query('SELECT title FROM items WHERE id = $1', [c.item_id]);
    if (decision === 'approved') {
      await cx.query("UPDATE items SET status = 'claimed' WHERE id = $1", [c.item_id]);
      const others = await cx.query(
        "UPDATE claims SET status = 'rejected', admin_note = 'Another claim for this item was approved.', reviewed_by = $2 WHERE item_id = $1 AND id <> $3 AND status = 'pending' RETURNING claimant_id",
        [c.item_id, req.user.id, c.id]);
      for (const o of others.rows) await notify(o.claimant_id, `Your claim for "${item.title}" was not approved.`, 'rejected', '/claims', cx);
    }
    await notify(c.claimant_id,
      decision === 'approved' ? `Your claim for "${item.title}" was approved. Visit the office to pick it up.`
        : `Your claim for "${item.title}" was rejected. Reason: ${note.trim()}`,
      decision === 'approved' ? 'approved' : 'rejected', '/claims', cx);
    return c;
  });
  if (!done) return res.status(409).json({ message: 'Claim not found or already reviewed' });
  res.json({ ok: true });
};

exports.recordReturn = async (req, res) => {
  const done = await db.tx(async (cx) => {
    const { rows: [c] } = await cx.query(
      "UPDATE claims SET returned_at = NOW() WHERE id = $1 AND status = 'approved' AND returned_at IS NULL RETURNING *", [req.params.id]);
    if (!c) return null;
    const { rows: [item] } = await cx.query("UPDATE items SET status = 'returned' WHERE id = $1 RETURNING title, reported_by", [c.item_id]);
    await notify(c.claimant_id, `"${item.title}" was returned to you. Thank you!`, 'returned', '/claims', cx);
    await notify(item.reported_by, `The item you found, "${item.title}", was returned to its owner. Thank you!`, 'returned', '/reports', cx);
    return c;
  });
  if (!done) return res.status(409).json({ message: 'Only an approved claim that is not yet returned can be completed' });
  res.json({ ok: true });
};
