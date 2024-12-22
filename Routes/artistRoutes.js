const express = require('express');
const router = express.Router();
// const { getArtistById } = require('../Controllers/artistController');
const upload = require('../MiddleWare/multer'); // Multer middleware لتحميل الصور
const { createArtist, updateArtist, getArtistById } = require('../Controllers/artistController');

// إنشاء فنان جديد
router.post('/', upload.single('image'), createArtist);

// تعديل فنان موجود
router.put('/:id', upload.single('image'), updateArtist);

// Route للحصول على فنان بواسطة ID
router.get('/:id', getArtistById);

module.exports = router;
