const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const notifications = require('../controllers/notifications.controller');

router.get('/', requireAuth, notifications.list);
router.get('/unread', requireAuth, notifications.unread);
router.patch('/read-all', requireAuth, notifications.readAll);
router.patch('/:id/read', requireAuth, notifications.read);

module.exports = router;
