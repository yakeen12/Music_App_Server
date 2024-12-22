const express = require('express');
const router = express.Router();
const songController = require('../Controllers/songController');

// الحصول على كل الأغاني
router.get('/', songController.getAllSongs);

// إضافة أغنية جديدة
router.post('/', songController.addSong);

// حذف أغنية
// router.delete('/:id', songController.deleteSong);

// إضافة أو إزالة إعجاب
router.post('/:songId/like', toggleLike);

module.exports = router;
