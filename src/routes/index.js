const express = require('express');
const router = express.Router();
const { apiKey, permission } = require('../auth/checkAuth');

//check apikey
router.use(apiKey);
//check premission
router.use(permission('0000'));

router.use('/v1/api/product', require('./product'));
router.use('/v1/api/notification', require('./notification'));

router.use('/v1/api', require('./access'));

module.exports = router;
