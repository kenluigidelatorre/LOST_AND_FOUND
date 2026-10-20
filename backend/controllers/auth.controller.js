const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const sign = (u) => jwt.sign({ id: u.id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
const pub = (u) => ({ id: u.id, name: u.name, email: u.email, studentId: u.student_id, role: u.role });

exports.register = async (req, res) => {
  const { name, studentId, email, password } = req.body;
  if (!name?.trim() || !studentId?.trim() || !email?.trim() || !password || password.length < 8)
    return res.status(400).json({ message: 'All fields are required and the password needs at least 8 characters' });
  const dup = await db.query('SELECT 1 FROM users WHERE email = $1 OR student_id = $2', [email.toLowerCase().trim(), studentId.trim()]);
  if (dup.rowCount) return res.status(409).json({ message: 'That email or student ID is already registered' });
  // role is always "student" here; admins are created in the database
  const { rows } = await db.query(
    'INSERT INTO users (name, student_id, email, password) VALUES ($1,$2,$3,$4) RETURNING *',
    [name.trim(), studentId.trim(), email.toLowerCase().trim(), await bcrypt.hash(password, 10)]);
  res.status(201).json({ token: sign(rows[0]), user: pub(rows[0]) });
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  const { rows } = await db.query('SELECT * FROM users WHERE email = LOWER($1) OR student_id = $1', [String(identifier || '').trim()]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password || '', user.password)))
    return res.status(401).json({ message: 'Invalid email/student ID or password' });
  res.json({ token: sign(user), user: pub(user) });
};

exports.me = async (req, res) => {
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  if (!rows[0]) return res.status(401).json({ message: 'Please log in' });
  res.json(pub(rows[0]));
};
