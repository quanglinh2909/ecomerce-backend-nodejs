const express = require('express');
const notificationController = require('../../controllers/notification.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// authentication
router.use(authentication);

router.get('', asyncHandler(notificationController.listNotiByUser));

module.exports = router;
