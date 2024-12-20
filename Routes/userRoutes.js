const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');


// الحصول على ملف المستخدم
router.get('/profile', userController.getUserProfile);

// تحديث ملف المستخدم
router.put('/profile', userController.updateUserProfile);


module.exports = router;
