const router = require('express').Router();
const { requireAuth, optionalAuth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const items = require('../controllers/items.controller');
const adminOnly = [requireAuth, requireRole('admin')];

// Keep static paths before /:id so they are not treated as item IDs.
router.get('/', items.list);
router.get('/recent', items.recent);
router.get('/locations', items.locations);
router.get('/mine', requireAuth, items.mine);
router.get('/admin/all', ...adminOnly, items.adminList);
router.post('/', requireAuth, upload.single('image'), items.create);
router.patch('/:id/review', ...adminOnly, items.review);
router.get('/:id', optionalAuth, items.getOne);

module.exports = router;
