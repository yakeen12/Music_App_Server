const express = require('express');
const router = express.Router();
const authenticate = require('../MiddleWare/authenticate');
const playListsController = require('../Controllers/playListsController');



// جلب البلاي ليستات العامة الخاصة بيوزر معين
router.get('/public/:userId', playListsController.getPublicPlaylists);

// إنشاء بلاي ليست جديدة
router.post('/create', authenticate, playListsController.createPlaylist);


// حذف بلاي ليست
router.delete('/delete', authenticate, playListsController.deletePlaylist);


// إضافة أغنية للبلاي ليست
router.put('/:id/add-song', authenticate, playListsController.addSongToPlaylist);

// حذف أغنية من البلاي ليست
router.put('/:id/remove-song', authenticate, playListsController.removeSongFromPlaylist);


// تحديث بلاي ليست
router.put('/:id', authenticate, playListsController.updatePlaylist);

// جلب بلاي ليستات اليوزر
router.get('/', authenticate, playListsController.getUserPlaylists);

module.exports = router;
