const express = require('express');
const router = express.Router();
// const { getArtistById } = require('../Controllers/artistController');
const upload = require('../MiddleWare/multer'); // Multer middleware لتحميل الصور
const authenticate = require('../MiddleWare/authenticate');  // استيراد الميدل وير للتحقق من التوكن
const { createArtist, updateArtist, getArtistById } = require('../Controllers/artistController');

// إنشاء فنان جديد
router.post('/', upload.single('image'), createArtist);

// تعديل فنان موجود
router.put('/:id', upload.single('image'), updateArtist);

// Route للحصول على فنان بواسطة ID
router.get('/:id', getArtistById);

// get all artists للسيرتش 


module.exports = router;
