const express = require('express');
const router = express.Router();
// const { getArtistById } = require('../Controllers/artistController');
const { createArtist, updateArtist, getArtistById } = require('../Controllers/artistController');

// إنشاء فنان جديد
router.post('/',  createArtist);

// تعديل فنان موجود
router.put('/:id', updateArtist);

// Route للحصول على فنان بواسطة ID
router.get('/:id', getArtistById);

// get all artists للسيرتش 


module.exports = router;
