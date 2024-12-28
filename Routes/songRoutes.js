const express = require('express');
const router = express.Router();
const songController = require('../Controllers/songController');

// الحصول على كل الأغاني
router.get('/', songController.getAllSongs);

// إضافة أغنية جديدة
router.post('/', songController.addSong);

router.get('/:id', songController.getSongDetails);

router.get('/latest', getLatestSongs);


// حذف أغنية
// router.delete('/:id', songController.deleteSong);

// إضافة أو إزالة إعجاب
router.post('/:songId/like', songController.addLike);

module.exports = router;
