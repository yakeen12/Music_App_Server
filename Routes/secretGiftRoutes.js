const express = require('express');
const router = express.Router();
const { sendSecretGift, getSentGifts, getReceivedGifts } = require('../Controllers/secretGiftController');
const authenticate = require('../MiddleWare/authenticate');

// Send a secret gift
router.post('/send', sendSecretGift);

// Get all gifts received by the logged-in user
router.get('/received', authenticate, getReceivedGifts);

module.exports = router;
