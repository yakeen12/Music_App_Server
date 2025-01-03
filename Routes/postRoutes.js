const express = require('express');
const authenticate = require('../MiddleWare/authenticate');  // استيراد الميدل وير للتحقق من التوكن
const router = express.Router();
const Post = require('../Controllers/postController');

// إضافة منشور
router.post('/add', Post.createPost);

// عرض جميع المنشورات
router.get('/', Post.getAllPosts);

// مسار للحصول على منشور حسب ID
router.get('/:postId', Post.getPostById);

// // مسار لتحديث منشور
// router.put('/:postId', Post.updatePost);

module.exports = router;
