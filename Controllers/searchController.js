const Post = require('../Models/post');
const Song = require('../Models/song');
const Episode = require('../Models/episode');
const User = require('../Models/user');
const Artist = require('../Models/artist');
const Podcast = require('../Models/podcast');

// البحث في كافة العناصر مع التجزئة و دعم البحث الجزئي
exports.search = async (req, res) => {
    const { query, page = 1, limit = 10 } = req.query;  // الحصول على نص البحث من الـ query parameter، مع default page=1 و limit=10

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const regexQuery = { '$regex': query, '$options': 'i' }; // البحث الجزئي مع تجاهل حالة الأحرف

        // التجزئة: تحديد الصفحة والحد الأقصى للنتائج
        const skip = (page - 1) * limit;

        // البحث في جميع العناصر مع التجزئة
        const posts = await Post.find({ 'content': regexQuery }).skip(skip).limit(Number(limit)).lean();
        const songs = await Song.find({ 'title': regexQuery }).skip(skip).limit(Number(limit)).lean();
        const episodes = await Episode.find({ 'title': regexQuery }).skip(skip).limit(Number(limit)).lean();
        const users = await User.find({ 'userName': regexQuery }).skip(skip).limit(Number(limit)).lean();
        const artists = await Artist.find({ 'name': regexQuery }).skip(skip).limit(Number(limit)).lean();
        const podcasts = await Podcast.find({ 'title': regexQuery }).skip(skip).limit(Number(limit)).lean();

        // إرجاع النتيجة في صيغة JSON
        return res.json({
            posts,
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
