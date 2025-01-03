const express = require('express');
const authenticate = require('../MiddleWare/authenticate');  // استيراد الميدل وير للتحقق من التوكن
const router = express.Router();
const postController = require('../Controllers/postController');


//لايك للبوست
router.post('/:postId/like', authenticate, postController.toggleLike);

// إضافة منشور
router.post('/add', authenticate, postController.createPost);

// by community
router.get('/:communityName', authenticate, postController.getPostsByCommunity)

// مسار للحصول على منشور حسب ID
router.get('/:postId', authenticate, postController.getPostById);

// عرض جميع المنشورات
router.get('/', authenticate, postController.getAllPosts);




module.exports = router;
