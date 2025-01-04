const Comment = require('../Models/comment');
const Post = require('../Models/post');

// إضافة تعليق إلى منشور
exports.addComment = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { postId } = req.params;
    const { content } = req.body;
    const user = await req.user.userId;
    if (content == null) { return res.status(404).json({ message: 'content empty' }); }
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = new Comment({
            content: content,
            user: user,
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
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// الحصول على تعليقات منشور
exports.getCommentsForPost = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { postId } = req.params;
    const user = await req.user.userId;

    try {
        const comments = await Comment.find({ post: postId }).populate('user', 'username profilePicture').sort({ createdAt: -1 }).lean();
        const formattedComments = comments.map(comment => ({
            ...comment,
            likesCount: comment.likes.length.toString(),// حساب عدد اللايكات
            hasLiked: comment.likes.includes(user)
        }));

        res.status(200).json(formattedComments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


// ميثود لإضافة أو إزالة لايك للكومنتر
exports.likeComment = async (req, res) => {
    try {
        const userId = req.user.userId; // الحصول على الـ userId من الـ token
        const commentId = req.params.id; // الحصول على الـ commentId من الـ URL parameter

        const comment = await Comment.findById(commentId).populate('user', 'username profilePicture').lean(); // العثور على الكومنتر بناءً على الـ commentId
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }

        // إذا كان المستخدم قد أعطى لايك للكومنتر مسبقاً، نقوم بإزالته
        if (comment.likes.includes(userId)) {
            comment.likes = comment.likes.filter(like => like.toString() !== userId.toString()); // إزالة الـ userId من likes

        }

        // إذا لم يكن قد أعطى لايك مسبقاً، نقوم بإضافته
        comment.likes.push(userId);
        await comment.save();

        const updatedComment = {
            ...post.toObject(), // تحويل البوست إلى كائن عادي
            hasLiked: comment.likes.includes(userId), // تحقق إذا كان اليوزر قد وضع لايك
            likesCount: comment.likes.length.toString(),
        };

        res.status(200).send(updatedComment);
    } catch (error) {
        res.status(500).send({ error: 'Failed to add/remove like' });
    }
};