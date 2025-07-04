const express = require('express');
const router = express.Router();
const authenticate = require('../MiddleWare/authenticate');  // استيراد الميدل وير للتحقق من التوكن
const songController = require('../Controllers/songController');

// الحصول على كل الأغاني
router.get('/', songController.getAllSongs);

// إضافة أغنية جديدة
router.post('/', songController.addSong);

router.get('/latest', songController.getLatestSongs);


router.get('/:id', songController.getSongDetails);



// حذف أغنية
// router.delete('/:id', songController.deleteSong);

// إضافة أو إزالة إعجاب
router.post('/:songId/like', songController.addLike);

module.exports = router;
