
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
            .populate({
                path: 'episode',
                populate: {
                    path: "podcast",
                    select: "title img"
                }
            })  // استرجاع تفاصيل البودكاست (إذا موجود)
            .sort({ createdAt: -1 });  // ترتيب البوستات بناءً على التاريخ (الأحدث أولاً)

        // إضافة حالة hasLiked لكل بوست
        const postsWithLikes = posts.map(post => {
            const hasLiked = post.likes.includes(user);  // تحقق إذا كان اليوزر قد وضع لايك
            return {
                ...post.toObject(),  // تحويل الكائن إلى شكل عادي يمكن تعديله
                hasLiked,  // إضافة حالة اللايك
                likesCount: post.likes.length.toString(),// حساب عدد اللايكات
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
                    select: 'name ', // استرجاع اسم الفنان وسيرته الذاتية فقط
                },
            }) // استرجاع تفاصيل الأغنية (إذا موجودة)
            .populate({
                path: 'episode',
                populate: {
                    path: "podcast",
                    select: "title img"
                }
            })  // استرجاع تفاصيل البودكاست (إذا موجود)
            .sort({ createdAt: -1 });  // ترتيب البوستات بناءً على التاريخ (الأحدث أولاً)
        // إضافة حالة hasLiked لكل بوست
        const postsWithLikes = posts.map(post => {
            const hasLiked = post.likes.includes(user);  // تحقق إذا كان اليوزر قد وضع لايك
            return {
                ...post.toObject(),  // تحويل الكائن إلى شكل عادي يمكن تعديله
                hasLiked,  // إضافة حالة اللايك
                likesCount: post.likes.length.toString(),// حساب عدد اللايكات
            };
        });

        res.status(200).json(postsWithLikes);  // إرجاع البوستات مع حالة hasLiked
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts', error: err.message });
    }
};



exports.getPostById = async (req, res) => {
    const userId = req.user?.userId; // تحقق من وجود userId
    const { postId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const post = await Post.findById(postId)
            .populate('user', 'username profilePicture')
            .populate({
                path: 'song',
                populate: {
                    path: 'artist',
                    select: 'name',
                },
            })
            .populate({
                path: 'episode',
                populate: {
                    path: 'podcast',
                    select: 'title img',
                },
            });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const updatedPost = {
            ...post.toObject(),
            hasLiked: post.likes.includes(userId),
            likesCount: post.likes.length.toString(),
        };

        res.status(200).json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching post', error: err.message });
    }
};



exports.getPostsByUserId = async (req, res) => {
    const { userId } = req.params; // الحصول على userId من الباراميتر
    const currentUserId = req.user.userId; // الحصول على الـ userId الحالي من التوكين

    try {
        // العثور على البوستات المرتبطة بـ userId المحدد
        const posts = await Post.find({ user: userId })
            .populate('user', 'username profilePicture')
            .populate({
                path: 'song',
                populate: { path: 'artist', select: 'name' },
            })
            .populate({
                path: 'episode',
                populate: { path: "podcast", select: "title" },
            })
            .sort({ createdAt: -1 });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user' });
        }

        // إضافة حالة hasLiked لكل بوست
        const postsWithLikes = posts.map(post => {
            const hasLiked = post.likes.includes(currentUserId); // التحقق من حالة اللايك
            return {
                ...post.toObject(), // تحويل الكائن إلى كائن عادي
                hasLiked,           // إضافة حالة الإعجاب
                likesCount: post.likes.length.toString(),
            };
        });

        res.status(200).json(postsWithLikes); // إرجاع البوستات مع حالة الإعجاب
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts by user', error: err.message });
    }
};


exports.toggleLike = async (req, res) => {
    const { postId } = req.params;
    const userId = await req.user.userId

    try {
        const post = await Post.findById(postId).populate('user', 'username profilePicture')  // استرجاع اسم اليوزر
            .populate({
                path: 'song', // ربط الأغنية
                populate: { // بوبيوليت للفنان المرتبط بالأغنية
                    path: 'artist',
                    select: 'name', // استرجاع اسم الفنان وسيرته الذاتية فقط
                },
            }) // استرجاع تفاصيل الأغنية (إذا موجودة)
            .populate({
                path: 'episode',
                populate: {
                    path: "podcast",
                    select: "title, img"
                }
            });
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
        const updatedPost = {
            ...post.toObject(), // تحويل البوست إلى كائن عادي
            hasLiked: post.likes.includes(userId), // تحقق إذا كان اليوزر قد وضع لايك
            likesCount: post.likes.length.toString(),
        };

        res.status(200).json(updatedPost);  // إرجاع البوستات مع حالة hasLiked
    } catch (err) {
        res.status(500).json({ message: 'Error toggling like', error: err.message });
    }
};