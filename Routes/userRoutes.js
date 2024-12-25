const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const authenticate = require('../MiddleWare/authenticate');  // استيراد الميدل وير للتحقق من التوكن

// الحصول على ملف المستخدم
router.get('/profile', authenticate, userController.getUserProfile);

// تحديث ملف المستخدم
router.put('/profile', userController.updateUserProfile);


module.exports = router;
