const express = require('express');
const router = express.Router();
const { sendSecretGift, getSentGifts, getReceivedGifts } = require('../Controllers/secretGiftController');
const authenticate = require('../Middleware/authenticate');

// Send a secret gift
router.post('/send', authenticate, sendSecretGift);

// Get all gifts sent by the logged-in user
router.get('/sent', authenticate, getSentGifts);

// Get all gifts received by the logged-in user
router.get('/received', authenticate, getReceivedGifts);

module.exports = router;
