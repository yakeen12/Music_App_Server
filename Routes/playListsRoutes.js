const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../MiddleWare/authenticate'); // التحقق من المستخدم

const playListsController = require('../Controllers/playListsController');

console.log('playListsController:', playListsController);


// جلب البلاي ليستات العامة الخاصة بيوزر معين
router.get('/public/:userId', playListsController.getPublicPlaylists);

// إنشاء بلاي ليست جديدة
router.post('/create', authenticateUser, playListsController.createPlaylist);


// حذف بلاي ليست
router.delete('/delete', authenticateUser, playListsController.deletePlaylist);


// إضافة أغنية للبلاي ليست
router.put('/:id/add-song', authenticateUser, playListsController.addSongToPlaylist);

// حذف أغنية من البلاي ليست
router.put('/:id/remove-song', authenticateUser, playListsController.removeSongFromPlaylist);


// تحديث بلاي ليست
router.put('/:id', authenticateUser, playListsController.updatePlaylist);

// جلب بلاي ليستات اليوزر
router.get('/', authenticateUser, playListsController.getUserPlaylists);

module.exports = router;
