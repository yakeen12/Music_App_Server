const Post = require('../Models/post');
const Song = require('../Models/song');
const Episode = require('../Models/episode');
const User = require('../Models/user');
const Artist = require('../Models/artist');
const Podcast = require('../Models/podcast');

exports.search = async (req, res) => {
    const { query, page = 1, limit = 10, user } = req.query;

    if (!query || query.trim() === '') {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const regexQuery = new RegExp(query, 'i');  // البحث الجزئي مع تجاهل حالة الأحرف
        const skip = (page - 1) * limit;
        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: 'users',  // اسم مجموعة اليوزر في الـ MongoDB
                    localField: 'user',  // الحقل الذي يربط البوست باليوزر
                    foreignField: '_id',  // الحقل الذي يربط اليوزر بالبوست
                    as: 'user_info'  // اسم الحقل الذي سيتم تخزين البيانات فيه
                }
            },
            {
                $unwind: '$user_info'  // لتفكيك البيانات بعد الربط
            },
            {
                $match: {
                    $or: [
                        { 'content': { $regex: regexQuery, $options: 'i' } },
                        { 'user_info.username': { $regex: regexQuery, $options: 'i' } }  // البحث في اسم المستخدم داخل الـ user_info
                    ]
                }
            },
            {
                $skip: skip
            },
            {
                $limit: Number(limit)
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    content: 1,
                    createdAt: 1,
                    likes: 1,
                    'user_info.username': 1,
                    'user_info.profilePicture': 1,  // إضافة صورة اليوزر هنا
                    likesCount: { $size: "$likes" }  // حساب عدد اللايكات
                }
            }
        ]);

        const postsWithLikes = posts.map(post => {
            const hasLiked = post.likes.includes(user);
            return { ...post, hasLiked, likesCount: post.likes.toString() };
        });

        // البحث في البودكاستات
        const podcasts = await Podcast.find({ 'title': regexQuery })
            .skip(skip)
            .limit(Number(limit))
            .populate({
                path: 'episodes',
                populate: {
                    path: 'podcast',
                    select: 'title img',
                },
            })
            .lean();

        // البحث في الحلقات
        const episodes = await Episode.find({
            $or: [
                { 'title': { $regex: regexQuery } },
                { 'podcast.title': { $regex: regexQuery } }
            ]
        })
            .skip(skip)
            .limit(Number(limit))
            .populate({
                path: 'podcast',
                select: 'title img',
            })
            .lean();

        // البحث في الأغاني
        const songs = await Song.find({
            $or: [
                { 'title': { $regex: regexQuery } },
                { 'artist.name': { $regex: regexQuery } }
            ]
        }).skip(skip).limit(Number(limit))
            .populate({ path: 'artist', select: 'name' })
            .lean();

        // البحث في المستخدمين
        const users = await User.find({ 'username': regexQuery })
            .skip(skip)
            .limit(Number(limit))
            .select('-password')
            .lean();

        // البحث في الفنانين
        const artists = await Artist.find({ 'name': regexQuery })
            .skip(skip)
            .limit(Number(limit))
            .populate({
                path: 'songs',
                populate: { path: 'artist', select: 'name' }
            })
            .lean();

        return res.json({
            posts: postsWithLikes,
            songs,
            episodes,
            users,
            artists,
            podcasts,
            page: Number(page),
            limit: Number(limit)
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
