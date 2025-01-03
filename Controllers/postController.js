
const Post = require('../Models/post');
const User = require('../Models/user');

// 1. إضافة بوست جديد
exports.createPost = async (req, res) => {
    const { community, content, songId, episodeId } = req.body;


    // التأكد من أن اليوزر موجود في قاعدة البيانات
    const user = await req.user.userId;
    console.log(user);


    try {
        const newPost = new Post({
            community,
            user,
            content,
            song: songId || null,  // إذا كانت الأغنية موجودة
            episode: episodeId || null,  // إذا كان البودكاست موجود
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error creating post', err });
    }
};

// 2. عرض بوستات كوميونيتي بناءً على اسم الكوميونيتي
exports.getPostsByCommunity = async (req, res) => {
    const user = await req.user.userId;
    console.log(user);
    const { communityName } = req.params;

    try {
        const posts = await Post.find({ community: communityName })
            .populate('user', 'username profilePicture')  // استرجاع اسم اليوزر
            .populate({
                path: 'song', // ربط الأغنية
                populate: { // بوبيوليت للفنان المرتبط بالأغنية
                    path: 'artist',
                    select: 'name', // استرجاع اسم الفنان وسيرته الذاتية فقط
                },
            }) // استرجاع تفاصيل الأغنية (إذا موجودة)
            .populate('episode')  // استرجاع تفاصيل البودكاست (إذا موجود)
            .sort({ createdAt: -1 });  // ترتيب البوستات بناءً على التاريخ (الأحدث أولاً)

        // إضافة حالة hasLiked لكل بوست
        const postsWithLikes = posts.map(post => {
            const hasLiked = post.likes.includes(user);  // تحقق إذا كان اليوزر قد وضع لايك
            return {
                ...post.toObject(),  // تحويل الكائن إلى شكل عادي يمكن تعديله
                hasLiked,  // إضافة حالة اللايك
            };
        });

        res.status(200).json(postsWithLikes);  // إرجاع البوستات مع حالة hasLiked
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts', error: err.message });
    }
};


exports.getAllPosts = async (req, res) => {
    const user = await req.user.userId;
    console.log(user);

    try {
        const posts = await Post.find()
            .populate('user', 'username profilePicture')  // استرجاع اسم اليوزر
            .populate({
                path: 'song', // ربط الأغنية
                populate: { // بوبيوليت للفنان المرتبط بالأغنية
                    path: 'artist',
                    select: 'name', // استرجاع اسم الفنان وسيرته الذاتية فقط
                },
            }) // استرجاع تفاصيل الأغنية (إذا موجودة)
            .populate('episode')  // استرجاع تفاصيل البودكاست (إذا موجود)
            .sort({ createdAt: -1 });  // ترتيب البوستات بناءً على التاريخ (الأحدث أولاً)
        // إضافة حالة hasLiked لكل بوست
        const postsWithLikes = posts.map(post => {
            const hasLiked = post.likes.includes(user);  // تحقق إذا كان اليوزر قد وضع لايك
            return {
                ...post.toObject(),  // تحويل الكائن إلى شكل عادي يمكن تعديله
                hasLiked,  // إضافة حالة اللايك
            };
        });

        res.status(200).json(postsWithLikes);  // إرجاع البوستات مع حالة hasLiked
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts', error: err.message });
    }
};



exports.getPostById = async (req, res) => {
    const { userId } = await req.user.userId
    const { postId } = req.params;

    try {
        const posts = await Post.findById(postId)
            .populate('user', 'username profilePicture')  // استرجاع اسم اليوزر
            .populate({
                path: 'song', // ربط الأغنية
                populate: { // بوبيوليت للفنان المرتبط بالأغنية
                    path: 'artist',
                    select: 'name', // استرجاع اسم الفنان وسيرته الذاتية فقط
                },
            }) // استرجاع تفاصيل الأغنية (إذا موجودة)
            .populate('episode')  // استرجاع تفاصيل البودكاست (إذا موجود)
            .sort({ createdAt: -1 });  // ترتيب البوستات بناءً على التاريخ (الأحدث أولاً)
        // إضافة حالة hasLiked لكل بوست
        const postsWithLikes = posts.map(post => {
            const hasLiked = post.likes.includes(userId);  // تحقق إذا كان اليوزر قد وضع لايك
            return {
                ...post.toObject(),  // تحويل الكائن إلى شكل عادي يمكن تعديله
                hasLiked,  // إضافة حالة اللايك
            };
        });

        res.status(200).json(postsWithLikes);  // إرجاع البوستات مع حالة hasLiked
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts', error: err.message });
    }
};


exports.getPostsByUserId = async (req, res) => {
    const { userId } = await req.user.userId

    try {
        const posts = await Post.find({ user: userId })  // العثور على البوستات المرتبطة بالـ userId
            .populate('user', 'username profilePicture')  // استرجاع اسم اليوزر
            .populate({
                path: 'song', // ربط الأغنية
                populate: { // بوبيوليت للفنان المرتبط بالأغنية
                    path: 'artist',
                    select: 'name', // استرجاع اسم الفنان وسيرته الذاتية فقط
                },
            }) // استرجاع تفاصيل الأغنية (إذا موجودة)
            .populate('episode')  // استرجاع تفاصيل البودكاست (إذا موجود)
            .sort({ createdAt: -1 });  // ترتيب البوستات بناءً على التاريخ (الأحدث أولاً)
        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user' });
        }

        // إضافة حالة hasLiked لكل بوست
        const postsWithLikes = posts.map(post => {
            const hasLiked = post.likes.includes(userId);  // تحقق إذا كان اليوزر قد وضع لايك
            return {
                ...post.toObject(),  // تحويل الكائن إلى شكل عادي يمكن تعديله
                hasLiked,  // إضافة حالة اللايك
            };
        });

        res.status(200).json(postsWithLikes);  // إرجاع البوستات مع حالة hasLiked
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts by user', error: err.message });
    }
};

exports.toggleLike = async (req, res) => {
    const { postId } = req.params;
    const userId = await req.user.userId

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // تحقق إذا كان اليوزر قد وضع لايك مسبقًا
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // إزالة اللايك
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
        } else {
            // إضافة اللايك
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json({ message: 'Like toggled successfully', post });
    } catch (err) {
        res.status(500).json({ message: 'Error toggling like', error: err.message });
    }
};