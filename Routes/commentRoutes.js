const express = require('express');
const router = express.Router();
const commentController = require('../Controllers/commentController');
const authenticate = require('../MiddleWare/authenticate');  // استيراد الميدل وير للتحقق من التوكن


router.post('/like/:id', authenticate, commentController.likeComment);
// إضافة تعليق على منشور 
router.post('/add/:postId', authenticate, commentController.addComment);

// عرض التعليقات الخاصة بمنشور
router.get('/post/:postId', commentController.getCommentsForPost);

module.exports = router;
