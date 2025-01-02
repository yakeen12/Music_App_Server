const express = require('express');
const router = express.Router();
const podcastController = require('../Controllers/podcastController');




// حذف بودكاست
router.get('/:id', podcastController.getPodcastById);

// حذف بودكاست
router.delete('/:id', podcastController.deletePodcast);

// الحصول على جميع البودكاست
router.get('/', podcastController.getAllPodcasts);

// إضافة بودكاست جديد
router.post('/', podcastController.createPodcast);





module.exports = router;
