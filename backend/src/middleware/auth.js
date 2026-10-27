const jwt = require('jsonwebtoken');

const read = (req) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try { return jwt.verify(token, process.env.JWT_SECRET); } catch { return null; }
};

exports.requireAuth = (req, res, next) => {
  const user = read(req);
  if (!user) return res.status(401).json({ message: 'Please log in' });
  req.user = user;
  next();
};
exports.optionalAuth = (req, res, next) => { req.user = read(req); next(); };
exports.requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Not allowed' });
