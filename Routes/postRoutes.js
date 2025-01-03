const express = require('express');
const authenticate = require('../MiddleWare/authenticate');  // استيراد الميدل وير للتحقق من التوكن
const router = express.Router();
const postController = require('../Controllers/postController');


//لايك للبوست
router.post('/post/:postId/like', authenticate, postController.toggleLike);

// إضافة منشور
router.post('/add', authenticate, postController.createPost);

// مسار للحصول على منشور حسب ID
router.get('/:postId', postController.getPostById);

// عرض جميع المنشورات
router.get('/', postController.getAllPosts);




module.exports = router;
