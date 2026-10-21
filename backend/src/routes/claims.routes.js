const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const claims = require('../controllers/claims.controller');
const adminOnly = [requireAuth, requireRole('admin')];

router.post('/', requireAuth, claims.create);
router.get('/mine', requireAuth, claims.mine);
router.get('/', ...adminOnly, claims.adminList);
router.get('/:id', ...adminOnly, claims.adminGet);
router.patch('/:id/decision', ...adminOnly, claims.decide);
router.post('/:id/return', ...adminOnly, claims.recordReturn);

module.exports = router;
