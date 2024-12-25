const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const upload = require('../MiddleWare/multer');

// تسجيل مستخدم جديد
router.post('/register', upload.single('profilePicture'), authController.register);

// تسجيل دخول
router.post('/login', authController.login);

router.get('/users', authController.getAllUsers); // تعريف المسار

router.post('/logout', authController.logout);

module.exports = router;
