const Comment = require('../Models/comment');
const Post = require('../Models/post');

// إضافة تعليق إلى منشور
exports.addComment = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { postId } = req.params;
    const { text } = req.body;
    const { userId } = req.user;
    if (text == null) { return res.status(404).json({ message: 'text empty' }); }
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = new Comment({
            text: text,
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
        const comments = await Comment.find({ post: postId }).populate('user', 'name');
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
