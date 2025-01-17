const Post = require('../Models/post');
const Song = require('../Models/song');
const Episode = require('../Models/episode');
const User = require('../Models/user');
const Artist = require('../Models/artist');
const Podcast = require('../Models/podcast');
const Playlist = require('../Models/playLists');

exports.search = async (req, res) => {
    const { query, page = 1, limit = 10 } = req.query;
    const currentUserId = req.user.userId;


    if (!query || query.trim() === '') {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const regexQuery = new RegExp(query, 'i');
        const skip = (page - 1) * limit;

        // البحث في البوستات
        const posts = await Post.aggregate([
            {
                "$lookup": {
                    "from": "users",
                    "let": { "user": "$user" },
                    "pipeline": [
                        { "$match": { "$expr": { "$eq": ["$_id", "$$user"] } } },
                        { "$project": { "username": 1, "profilePicture": 1 } }
                    ],
                    "as": "user"
                }
            },
            { "$unwind": "$user" },
            {
                "$match": {
                    "$or": [
                        { "user.username": { "$regex": regexQuery, } },
                        { "content": { "$regex": regexQuery, } }
                    ]
                }
            },
            {
                "$lookup": {
                    "from": "songs", // جدول الأغاني
                    "localField": "song",
                    "foreignField": "_id",
                    "as": "song"
                }
            },
            { "$unwind": { path: "$song", preserveNullAndEmptyArrays: true } }, // إذا لم يكن هناك أغنية، لا يحذف البوست
            {
                "$lookup": {
                    "from": "artists", // جدول الفنانين
                    "localField": "song.artist",
                    "foreignField": "_id",
                    "as": "song.artist"
                }
            },
            { "$unwind": { path: "$song.artist", preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "episodes", // جدول الحلقات
                    "localField": "episode",
                    "foreignField": "_id",
                    "as": "episode"
                }
            },
            { "$unwind": { path: "$episode", preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "podcasts", // جدول البودكاست
                    "localField": "episode.podcast",
                    "foreignField": "_id",
                    "as": "episode.podcast"
                }
            },
            { "$unwind": { path: "$episode.podcast", preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "comments", //  جدول الكومنتات
                    "localField": "comments",
                    "foreignField": "_id",
                    "as": "comments"
                }
            },

        ])
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });


        const postsWithLikes = posts.map(post => {
            const comments = Array.isArray(post.comments) ? post.comments : [post.comments];

            // نقوم بملء بيانات المستخدمين للتعليقات
            const populatedComments = comments.map(comment => {
                return {
                    ...comment,
                    user: comment.user,  // التأكد أن user موجود
                };
            }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // ترتيب التعليقات حسب التاريخ

            const hasLiked = post.likes.includes(currentUserId);
            return { ...post, hasLiked, likesCount: post.likes.length.toString(), comments: populatedComments };
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
        const users = await User.find({ 'username': regexQuery, _id: { $ne: currentUserId } })
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


exports.searchUsers = async (req, res) => {
    const { query, page = 1, limit = 10 } = req.query;
    const currentUserId = req.user.userId;


    if (!query || query.trim() === '') {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const regexQuery = new RegExp(query, 'i');
        const skip = (page - 1) * limit;


        // البحث في المستخدمين
        const users = await User.find({ 'username': regexQuery, _id: { $ne: currentUserId } })
            .skip(skip)
            .limit(Number(limit))
            .select('-password')
            .lean();


        return res.json({
            users,
            page: Number(page),
            limit: Number(limit)
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};


exports.searchPlayLists = async (req, res) => {
    const { query, page = 1, limit = 10, } = req.query;
    const currentUserId = req.user.userId;

    if (!query || query.trim() === '') {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const regexQuery = new RegExp(query, 'i');
        const skip = (page - 1) * limit;

        // البحث في الأغاني التي قام المستخدم بوضع لايك لها
        const likedSongs = await Song.find({
            likes: currentUserId,
            title: { $regex: regexQuery },
        })
            .skip(skip)
            .limit(Number(limit))
            .populate({ path: 'artist', select: 'name' })
            .lean();

        // البحث في قوائم التشغيل الخاصة بالمستخدم
        const playlists = await Playlist.find({
            createdBy: currentUserId,
            name: { $regex: regexQuery },
        })
            .skip(skip)
            .limit(Number(limit))
            .populate({
                path: 'songs',
                populate: { path: 'artist', select: 'name' }
            }).populate({
                path: 'createdBy',
                select: 'username profilePicture'  // جلب اسم وصورة اليوزر
            });

        // البحث في الأغاني داخل قوائم التشغيل
        const playlistSongs = await Playlist.aggregate([
            {
                "$lookup": {
                    "from": "songs",
                    "let": { "song": "$song" },
                    "pipeline": [
                        { "$match": { "$expr": { "$eq": ["$_id", "$$song"] } } },
                        { "$project": { "title": 1, "url": 1 } }
                    ],
                    "as": "song"
                }
            },
            { "$unwind": "$song" },
            {
                "$match": {
                    "$or": [
                        { "song.title": { "$regex": regexQuery } },
                    ]
                }
            }
            // {
            //     $match: { createdBy: currentUserId },
            // },
            // {
            //     $lookup: {
            //         from: 'songs',
            //         localField: 'songs',
            //         foreignField: '_id',
            //         as: 'songs',
            //     },
            // },
            // {
            //     $unwind: '$songs',
            // },
            // {
            //     $match: { 'songs.title': { $regex: regexQuery } },
            // },
            // {
            //     $group: {
            //         _id: '$_id',
            //         name: { $first: '$name' },
            //         createdBy: { $first: '$createdBy' },
            //         songs: { $push: '$songs' },
            //     },
            // },
        ])
            .skip(skip)
            .limit(Number(limit));



        return res.json({
            playlistSongs,
            playlists,
            likedSongs,
            page: Number(page),
            limit: Number(limit)
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};





exports.searchSongs = async (req, res) => {
    const { query, page = 1, limit = 10, user } = req.query;

    if (!query || query.trim() === '') {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const regexQuery = new RegExp(query, 'i');  // البحث الجزئي مع تجاهل حالة الأحرف
        const skip = (page - 1) * limit;


        // البحث في الأغاني
        const songs = await Song.find({
            $or: [
                { 'title': { $regex: regexQuery } },
                { 'artist.name': { $regex: regexQuery } }
            ]
        }).skip(skip).limit(Number(limit))
            .populate({ path: 'artist', select: 'name' })
            .lean();


        return res.json({

            songs,
            page: Number(page),
            limit: Number(limit)
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
