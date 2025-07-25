const Song = require('../Models/song');
const User = require('../Models/user'); // إذا كنت تحتاج للتفاعل مع المستخدمين
const Artist = require('../Models/artist');
// إضافة أغنية جديدة
exports.addSong = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { title, artistId, genre, url, img } = req.body;

    try {
        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }


        const newSong = new Song({
            title,
            artist: artistId,
            genre,
            url,
            img  // هذا سيشير إلى رابط أو مسار الملف الصوتي
        });

        await newSong.save();
        // تحديث قائمة الأغاني في الفنان
        artist.songs.push(newSong._id);
        await artist.save();
        res.status(201).json({ message: 'Song added successfully', song: newSong });
    } catch (error) {
        res.status(500).json({ message: 'Error adding song', error });
    }
};

// عرض جميع الأغاني
exports.getAllSongs = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    try {
        const songs = await Song.find().populate('artist');  // العثور على جميع الأغاني
        res.status(200).json({ songs });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching songs', error });
    }
};

// البحث عن أغنية حسب العنوان أو الفنان
exports.searchSongs = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

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
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

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
        // if (!song.likes.includes(userId)) {
        //     song.likes.push(userId);
        //     await song.save();
        //     res.status(200).json({ message: 'Song liked successfully' });
        // } else {
        //     res.status(400).json({ message: 'You already liked this song' });
        // }
        const index = song.likes.indexOf(userId);
        if (index === -1) {
            song.likes.push(userId); // إضافة إعجاب
        } else {
            song.likes.splice(index, 1); // إزالة إعجاب
        }
        await song.save();
        res.status(200).json(song);
    } catch (error) {
        res.status(500).json({ message: 'Error liking song', error });
    }
};


// GET: استرجاع أحدث 10 أغاني
exports.getLatestSongs = async (req, res) => {
    try {
        console.log('Fetching latest songs...');
        const songs = await Song.find().sort({ createdAt: -1 }).populate({ path: 'artist', select: 'name' }).limit(10);
        console.log('Songs found:', songs);

        if (songs.length === 0) {
            return res.status(404).json({ message: 'Song not found' });
        }

        res.json({ songs });
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ message: 'Error fetching latest songs', error });
    }
};