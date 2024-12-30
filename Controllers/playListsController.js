const Playlist = require('../Models/playLists');
const User = require('../Models/user');

// إنشاء بلاي ليست جديدة
exports.createPlaylist = async (req, res) => {
    const { name, isPublic = true, allowEditing = false } = req.body;

    try {
        const playlist = new Playlist({
            name,
            isPublic,
            allowEditing,
            createdBy: req.user.id,
        });

        await playlist.save();
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ message: 'Error creating playlist', error });
    }
};

// جلب بلاي ليستات اليوزر
// هاي لصفحة البلاي ليست في النافيقيشن بار تبع اليوزر
exports.getUserPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ createdBy: req.user.id }).populate({
            path: 'songs',
            populate: { path: 'artist', select: 'name' } // جلب اسم الفنان فقط
        });
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlists', error });
    }
};

exports.updatePlaylist = async (req, res) => {
    const { id } = req.params;
    const { songs, name, isPublic, allowEditing } = req.body;

    try {
        const playlist = await Playlist.findById(id);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        if (playlist.createdBy.toString() !== req.user.id && !playlist.allowEditing) {
            return res.status(403).json({ message: 'Not allowed to edit this playlist' });
        }

        if (songs) playlist.songs = songs;
        if (name) playlist.name = name;
        if (typeof isPublic === 'boolean') playlist.isPublic = isPublic;
        if (typeof allowEditing === 'boolean') playlist.allowEditing = allowEditing;

        await playlist.save();

        // جلب قائمة الأغاني المعجبة مرة أخرى مع التفاصيل
        const updatedPlayList = await Playlist.find({ createdBy: req.user.id }).populate({
            path: 'songs',
            populate: { path: 'artist', select: 'name' } // جلب اسم الفنان فقط
        });

        res.json(updatedPlayList);
    } catch (error) {
        res.status(500).json({ message: 'Error updating playlist', error });
    }
};

// هاي لصفحة البلاي ليست اللي بتبين ليوزر خارجي
exports.getPublicPlaylists = async (req, res) => {
    const { userId } = req.params; // جلب userId من المسار

    try {
        // البحث عن البلاي ليستات التي أنشأها اليوزر المستهدف والتي تكون ببلك
        const playlists = await Playlist.find({
            createdBy: userId,
            isPublic: true
        }).populate({
            path: 'songs',
            populate: { path: 'artist', select: 'name' } // جلب اسم الفنان فقط
        }).populate({
            path: 'createdBy',
            select: 'username profileImage'  // جلب اسم وصورة اليوزر
        });

        res.json(playlists); // إرجاع البلاي ليستات
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public playlists', error });
    }
};


exports.deletePlaylist = async (req, res) => {
    const { playlistId } = req.body;

    if (!playlistId) {
        return res.status(400).json({ message: 'Please provide the playlist ID' });
    }

    try {
        // التأكد من أن البلاي ليست التي سيتم حذفها تخص المستخدم الحالي
        const playlist = await Playlist.findOne({
            _id: playlistId,
            createdBy: req.user.id
        });

        // إذا لم يتم العثور على البلاي ليست أو إذا كانت لا تخص المستخدم
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found or does not belong to this user' });
        }

        // حذف البلاي ليست
        await Playlist.deleteOne({ _id: playlistId });

        res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting playlist', error });
    }
};

// بتحذف اغنية وحدة 
exports.removeSongFromPlaylist = async (req, res) => {
    const { id } = req.params; // البلاي ليست المطلوبة
    const { songId } = req.body; // الأغنية التي سيتم حذفها

    try {
        const playlist = await Playlist.findById(id);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // التأكد من أن اليوزر هو الذي أنشأ البلاي ليست أو أنه مسموح له بالتعديل
        if (playlist.createdBy.toString() !== req.user.id && !playlist.allowEditing) {
            return res.status(403).json({ message: 'Not allowed to edit this playlist' });
        }

        playlist.songs.pull(songId);

        await playlist.save();

        const updatedPlaylist = await Playlist.findById(id)
            .populate({
                path: 'songs',
                populate: {
                    path: 'artist',
                    select: 'name'
                }
            });

        res.json(updatedPlaylist);
    } catch (error) {
        res.status(500).json({ message: 'Error removing song from playlist', error });
    }
};




// بتضيف اغنية وحدة
exports.addSongToPlaylist = async (req, res) => {
    const { id } = req.params;
    const { songId } = req.body;

    try {
        const playlist = await Playlist.findById(id);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // التأكد من أن اليوزر هو الذي أنشأ البلاي ليست أو أنه مسموح له بالتعديل
        if (playlist.createdBy.toString() !== req.user.id && !playlist.allowEditing) {
            return res.status(403).json({ message: 'Not allowed to edit this playlist' });
        }

        playlist.songs.push(songId);

        await playlist.save();

        const updatedPlaylist = await Playlist.findById(id)
            .populate({
                path: 'songs',
                populate: {
                    path: 'artist',
                    select: 'name'
                }
            });

        res.json(updatedPlaylist);
    } catch (error) {
        res.status(500).json({ message: 'Error adding song to playlist', error });
    }
};



module.exports = {
    createPlaylist,
    getUserPlaylists,
    getPublicPlaylists,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist
};