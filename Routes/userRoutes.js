const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const authenticate = require('../MiddleWare/authenticate');  // استيراد الميدل وير للتحقق من التوكن

// الحصول على ملف المستخدم
router.get('/getprofile', authenticate, userController.getUserProfile);

// تحديث ملف المستخدم
router.put('/updateprofile', authenticate, userController.updateUserProfile);

// استرجاع الأغاني المفضلة
router.get('/likes', authenticate, userController.getLikedSongs);

// تفعيل أو إلغاء اللايك
router.post('/like', authenticate, userController.toggleLikeSong);

module.exports = router;
