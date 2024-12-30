const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../MiddleWare/authenticate'); // التحقق من المستخدم
const {
    createPlaylist,
    getUserPlaylists,
    getPublicPlaylists,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist
} = require('../Controllers/playListsController');


// إضافة أغنية للبلاي ليست
router.put('/:id/add-song',authenticateUser, addSongToPlaylist);

// حذف أغنية من البلاي ليست
router.put('/:id/remove-song', authenticateUser,removeSongFromPlaylist);


// جلب البلاي ليستات العامة الخاصة بيوزر معين
router.get('/public/:userId', getPublicPlaylists);

// إنشاء بلاي ليست جديدة
router.post('/create', authenticateUser, createPlaylist);


// حذف بلاي ليست
router.delete('/delete', authenticateUser, deletePlaylist);



// تحديث بلاي ليست
router.put('/:id', authenticateUser, updatePlaylist);

// جلب بلاي ليستات اليوزر
router.get('/', authenticateUser, getUserPlaylists);

module.exports = router;
