const Song = require('../Models/song');
const User = require('../Models/user'); // إذا كنت تحتاج للتفاعل مع المستخدمين

// إضافة أغنية جديدة
exports.addSong = async (req, res) => {
    const { title, artist, genre, url } = req.body;

    try {
        const newSong =  new Song({
            title,
            artist,
            genre,
            url,  // هذا سيشير إلى رابط أو مسار الملف الصوتي
        });

        await newSong.save();
        res.status(201).json({ message: 'Song added successfully', song: newSong });
    } catch (error) {
        res.status(500).json({ message: 'Error adding song', error });
    }
};

// عرض جميع الأغاني
exports.getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find();  // العثور على جميع الأغاني
        res.status(200).json({ songs });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching songs', error });
    }
};

// البحث عن أغنية حسب العنوان أو الفنان
exports.searchSongs = async (req, res) => {
    const { query } = req.query; // الحصول على الاستعلام من الـ URL

    try {
        const songs = await Song.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },  // البحث باستخدام عنوان الأغنية
                { artist: { $regex: query, $options: 'i' } },  // البحث باستخدام الفنان
            ]
        });

        if (songs.length === 0) {
            return res.status(404).json({ message: 'No songs found' });
        }

        res.status(200).json({ songs });
    } catch (error) {
        res.status(500).json({ message: 'Error searching songs', error });
    }
};

// عرض تفاصيل أغنية معينة
exports.getSongDetails = async (req, res) => {
    const { songId } = req.params;

    try {
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        res.status(200).json({ song });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching song details', error });
    }
};



// إضافة إعجاب على الأغنية
exports.addLike = async (req, res) => {
    const { songId } = req.body;
    const userId = req.userId; // الحصول على الـ userId من التوكين

    try {
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // إضافة الإعجاب
        if (!song.likes.includes(userId)) {
            song.likes.push(userId);
            await song.save();
            res.status(200).json({ message: 'Song liked successfully' });
        } else {
            res.status(400).json({ message: 'You already liked this song' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error liking song', error });
    }
};
