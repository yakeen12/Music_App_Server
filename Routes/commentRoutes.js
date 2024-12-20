const express = require('express');
const router = express.Router();
const Comment = require('../Controllers/commentController');
const Post = require('../Models/post');

// إضافة تعليق على منشور 
router.post('/add', Comment.addComment);

// عرض التعليقات الخاصة بمنشور
router.get('/post/:postId', Comment.getCommentsForPost);

module.exports = router;
