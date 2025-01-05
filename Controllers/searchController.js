const Post = require('../Models/post');
const Song = require('../Models/song');
const Episode = require('../Models/episode');
const User = require('../Models/user');
const Artist = require('../Models/artist');
const Podcast = require('../Models/podcast');

exports.search = async (req, res) => {
    const { query, page = 1, limit = 10, user } = req.query;  // الحصول على نص البحث من الـ query parameter، مع default page=1 و limit=10

    if (!query || query.trim() === '') {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const regexQuery = new RegExp(query, 'i');  // البحث الجزئي مع تجاهل حالة الأحرف

        // التجزئة: تحديد الصفحة والحد الأقصى للنتائج
        const skip = (page - 1) * limit;

        // البحث في البوستات مع التجزئة وربط البيانات
        const posts = await Post.find({
            $or: [
                { 'content': { $regex: regexQuery } },
                { 'user.username': { $regex: regexQuery } }
            ]
        })
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
                    path: "podcast",
                    select: "title img"
                }
            })
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 })
            .lean();

        // إضافة حالة hasLiked لكل بوست
        const postsWithLikes = posts.map(post => {
            const hasLiked = post.likes.includes(user);
            return {
                ...post,
                hasLiked,
                likesCount: post.likes.length.toString(),
            };
        });

        // البحث في العناصر الأخرى مثل الأغاني، الحلقات، البودكاست
        const songs = await Song.find({
            $or: [
                { 'title': { $regex: regexQuery } },
                { 'artist.name': { $regex: regexQuery } }
            ]
        }).skip(skip).limit(Number(limit)).populate({ path: 'artist', select: 'name' }).lean();

        const episodes = await Episode.find({
            $or: [
                { 'title': { $regex: regexQuery } },
                { 'podcast.title': { $regex: regexQuery } }
            ]
        }).skip(skip).limit(Number(limit)).populate({
            path: 'podcast',
            select: 'title img',
        }).lean();

        const users = await User.find({ 'username': regexQuery }).skip(skip).limit(Number(limit)).select('-password').lean();

        const artists = await Artist.find({
            'name': regexQuery
        }).skip(skip).limit(Number(limit)).populate({ path: "songs", populate: { path: 'artist', select: 'name' } }).lean();

        const podcasts = await Podcast.find({ 'title': regexQuery }).skip(skip).limit(Number(limit)).populate({
            path: 'episodes',
            populate: {
                path: 'podcast',
                select: 'title img',
            },
        }).lean();

        // إرجاع النتيجة في صيغة JSON
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
