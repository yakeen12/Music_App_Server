const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const authenticate = require('../MiddleWare/authenticate');  // استيراد الميدل وير للتحقق من التوكن

// الحصول على ملف المستخدم
router.get('/getprofile', authenticate, userController.getUserProfile);

// تحديث ملف المستخدم
router.put('/updateprofile', userController.updateUserProfile);


module.exports = router;
