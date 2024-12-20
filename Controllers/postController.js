const Post = require('../Models/post');

// إنشاء منشور جديد
exports.createPost = async (req, res) => {
    const { title, content, community } = req.body;
    const { userId } = req.user;

    try {
        const newPost = new Post({
            title,
            content,
            community,
            user: userId,
        });

        await newPost.save();

        res.status(201).json({
            message: 'Post created successfully',
            post: newPost,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// الحصول على جميع المنشورات
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// الحصول على منشور حسب ID
exports.getPostById = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId).populate('user', 'name');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// تحديث منشور
exports.updatePost = async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.title = title || post.title;
        post.content = content || post.content;

        await post.save();

        res.status(200).json({
            message: 'Post updated successfully',
            post,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
