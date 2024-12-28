const express = require('express');
const router = express.Router();
const authenticate = require('../MiddleWare/authenticate');  // استيراد الميدل وير للتحقق من التوكن
const podcastController = require('../Controllers/podcastController');

// الحصول على جميع البودكاست
router.get('/', podcastController.getAllPodcasts);

// إضافة بودكاست جديد
router.post('/', podcastController.createPodcast);

// حذف بودكاست
router.delete('/:id', podcastController.deletePodcast);

module.exports = router;
