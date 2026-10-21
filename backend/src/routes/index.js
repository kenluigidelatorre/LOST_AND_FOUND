const router = require('express').Router();

// Route groups preserve the existing public API paths.
router.use('/auth', require('./auth.routes'));
router.use('/items', require('./items.routes'));
router.use('/claims', require('./claims.routes'));
router.use('/notifications', require('./notifications.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;
