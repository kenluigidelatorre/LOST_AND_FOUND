const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const admin = require('../controllers/admin.controller');

router.get('/stats', requireAuth, requireRole('admin'), admin.stats);

module.exports = router;
