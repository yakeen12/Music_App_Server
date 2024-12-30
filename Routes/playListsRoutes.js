const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../MiddleWare/authenticate'); // التحقق من المستخدم
const {
    createPlaylist,
    getUserPlaylists,
    getPublicPlaylists,
    updatePlaylist,
    deletePlaylist,
} = require('../Controllers/playListsController');

// إنشاء بلاي ليست جديدة
router.post('/create', authenticateUser, createPlaylist);

// جلب بلاي ليستات اليوزر
router.get('/', authenticateUser, getUserPlaylists);

// جلب البلاي ليستات العامة الخاصة بيوزر معين
router.get('/public/:userId', getPublicPlaylists);

// تحديث بلاي ليست
router.put('/:id', authenticateUser, updatePlaylist);

// حذف بلاي ليست
router.delete('/delete', authenticateUser, deletePlaylist);

module.exports = router;
