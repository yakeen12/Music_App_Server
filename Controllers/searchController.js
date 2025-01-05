const Post = require('../Models/post');
const Song = require('../Models/song');
const Episode = require('../Models/episode');
const User = require('../Models/user');
const Artist = require('../Models/artist');
const Podcast = require('../Models/podcast');

// البحث في كافة العناصر مع التجزئة ودعم البحث الجزئي
exports.search = async (req, res) => {
    const { query, page = 1, limit = 10, user } = req.query;  // الحصول على نص البحث من الـ query parameter، مع default page=1 و limit=10

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const regexQuery = { '$regex': query, '$options': 'i' }; // البحث الجزئي مع تجاهل حالة الأحرف

        // التجزئة: تحديد الصفحة والحد الأقصى للنتائج
        const skip = (page - 1) * limit;

        // البحث في البوستات مع التجزئة وربط البيانات
        const posts = await Post.find({ 'content': regexQuery })
            .populate('user', 'username profilePicture')  // استرجاع اسم اليوزر
            .populate({
                path: 'song', // ربط الأغنية
                populate: { // بوبيوليت للفنان المرتبط بالأغنية
                    path: 'artist',
                    select: 'name', // استرجاع اسم الفنان
                },
            }) // استرجاع تفاصيل الأغنية (إذا موجودة)
            .populate({
                path: 'episode',
                populate: {
                    path: "podcast",
                    select: "title img"
                }
            })  // استرجاع تفاصيل البودكاست (إذا موجود)
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 })  // ترتيب البوستات بناءً على التاريخ (الأحدث أولاً)
            .lean();  // لتحويل النتائج إلى كائنات عادية

        // إضافة حالة hasLiked لكل بوست
        const postsWithLikes = posts.map(post => {
            const hasLiked = post.likes.includes(user);  // تحقق إذا كان اليوزر قد وضع لايك
            return {
                ...post,  // تحويل الكائن إلى شكل عادي يمكن تعديله
                hasLiked,  // إضافة حالة اللايك
                likesCount: post.likes.length.toString(), // حساب عدد اللايكات
            };
        });

        // البحث في العناصر الأخرى مثل الأغاني، الحلقات، البودكاست
        const songs = await Song.find({ 'title': regexQuery }).skip(skip).limit(Number(limit)).populate({ path: 'artist', select: 'name' }).lean();
        const episodes = await Episode.find({ 'title': regexQuery }).skip(skip).limit(Number(limit)).populate({
            path: 'podcast',
            select: 'title img',
        }).lean();
        const users = await User.find({ 'username': regexQuery }).skip(skip).limit(Number(limit)).select('-password').lean();
        const artists = await Artist.find({ 'name': regexQuery }).skip(skip).limit(Number(limit)).populate({ path: "songs", populate: { path: 'artist', select: 'name' } }).lean();
        const podcasts = await Podcast.find({ 'title': regexQuery }).skip(skip).limit(Number(limit)).populate({
            path: 'episodes', // ملء الحقل episodes
            populate: {
                path: 'podcast', // ملء الحقل podcast داخل episodes
                select: 'title img', // تحديد الحقول المطلوبة
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
