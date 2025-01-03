const express = require('express');
const router = express.Router();
const communityController = require('../Controllers/communityController');

// إنشاء كوميونيتي جديدة
router.post('/create', communityController.createCommunity);

module.exports = router;
