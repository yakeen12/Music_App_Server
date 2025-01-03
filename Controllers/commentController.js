const Comment = require('../Models/comment');
const Post = require('../Models/post');

// إضافة تعليق إلى منشور
exports.addComment = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = req.user.id;
    if (content == null) { return res.status(404).json({ message: 'content empty' }); }
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = new Comment({
            content: content,
            user: userId,
            post: postId,
        });

        await newComment.save();

        post.comments.push(newComment._id);
        await post.save();

        res.status(201).json({
            message: 'Comment added successfully',
            comment: newComment,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// الحصول على تعليقات منشور
exports.getCommentsForPost = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { postId } = req.params;

    try {
        const comments = await Comment.find({ post: postId }).populate('user', 'name profilePicture');
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


// ميثود لإضافة أو إزالة لايك للكومنتر
exports.likeComment = async (req, res) => {
    try {
      const userId = req.user._id; // الحصول على الـ userId من الـ token
      const commentId = req.params.id; // الحصول على الـ commentId من الـ URL parameter
  
      const comment = await Comment.findById(commentId); // العثور على الكومنتر بناءً على الـ commentId
      if (!comment) {
        return res.status(404).send({ error: 'Comment not found' });
      }
  
      // إذا كان المستخدم قد أعطى لايك للكومنتر مسبقاً، نقوم بإزالته
      if (comment.likes.includes(userId)) {
        comment.likes = comment.likes.filter(like => like.toString() !== userId.toString()); // إزالة الـ userId من likes
        await comment.save();
        return res.status(200).send({ message: 'Like removed' });
      }
  
      // إذا لم يكن قد أعطى لايك مسبقاً، نقوم بإضافته
      comment.likes.push(userId);
      await comment.save();
  
      res.status(200).send({ message: 'Like added', comment });
    } catch (error) {
      res.status(500).send({ error: 'Failed to add/remove like' });
    }
  };