const express = require('express');
const authenticate = require('../MiddleWare/authenticate');  
const router = express.Router();
const postController = require('../Controllers/postController');


// إضافة منشور
router.post('/add', authenticate, postController.createPost);

// عرض جميع المنشورات
router.get('/', authenticate, postController.getAllPosts);

// الحصول على منشور حسب ID (مسار محدد أكثر من اسم المجتمع)
router.get('/post/:postId', authenticate, postController.getPostById);

// المنشورات حسب المجتمع
router.get('/:communityName', authenticate, postController.getPostsByCommunity);

// لايك للبوست
router.post('/:postId/like', authenticate, postController.toggleLike);

// راوت لجلب البوستات بناءً على userId
router.get('/:userId/posts', authenticate, postController.getPostsByUserId);


module.exports = router;
