const Playlist = require('../Models/playLists');
const User = require('../Models/user');

// إنشاء بلاي ليست جديدة
exports.createPlaylist = async (req, res) => {
    const { name, isPublic = true, allowEditing = false } = req.body;

    console.log("createPlaylist", req.user.userId);
    console.log("createPlaylist req.user", req.user);
    try {
        const playlist = new Playlist({
            name,
            isPublic,
            allowEditing,
            createdBy: req.user.userId,
        });

        await playlist.save();
        res.status(201).json(playlist);
    } catch (error) {
        console.log('Error creating playlist', error);
        res.status(500).json({ message: 'Error creating playlist', error });
    }
};

// جلب بلاي ليستات اليوزر
// هاي لصفحة البلاي ليست في النافيقيشن بار تبع اليوزر
exports.getUserPlaylists = async (req, res) => {
    console.log("getUserPlaylists", req.user.userId);
    console.log("getUserPlaylists req.user", req.user);

    try {

        const playlist = await Playlist.findOne({ createdBy: req.user.userId });
        console.log("Playlist songs references:", playlist.songs);

        const playlists = await Playlist.find({ createdBy: req.user.userId }).populate({
            path: 'songs',
            populate: { path: 'artist', select: 'name' }
        }).populate({
            path: 'createdBy',
            select: 'username profilePicture'  // جلب اسم وصورة اليوزر
        });
        console.log("getUserPlaylists playlists", playlists);

        if (!playlists || playlists.length === 0) {
            return res.status(404).json({ message: 'No playlists found for this user' });
        }

        res.json(playlists);
    } catch (error) {
        console.log("getUserPlaylists error", error);

        res.status(500).json({ message: 'Error fetching playlists', error });
    }
};

exports.updatePlaylist = async (req, res) => {
    console.log("updatePlaylist", req.user.userId);
    console.log("updatePlaylist req.user", req.user);
    const { id } = req.params;
    const { songs, name, isPublic, allowEditing } = req.body;

    try {
        const playlist = await Playlist.findById(id);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        if (playlist.createdBy.toString() !== req.user.userId && !playlist.allowEditing) {
            return res.status(403).json({ message: 'Not allowed to edit this playlist' });
        }

        if (songs) playlist.songs = songs;
        if (name) playlist.name = name;
        if (typeof isPublic === 'boolean') playlist.isPublic = isPublic;
        if (typeof allowEditing === 'boolean') playlist.allowEditing = allowEditing;

        await playlist.save();

        const updatedPlayList = await Playlist.find({ createdBy: req.user.id }).populate({
            path: 'songs',
            populate: { path: 'artist', select: 'name' }
        }).populate({
            path: 'createdBy',
            select: 'username profilePicture'  // جلب اسم وصورة اليوزر
        });
        res.json(updatedPlayList);
    } catch (error) {
        console.log('Error updating playlist', error);
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
            select: 'username profilePicture'  // جلب اسم وصورة اليوزر
        });

        res.json(playlists); // إرجاع البلاي ليستات
    } catch (error) {
        console.log('Error fetching public playlists', error);
        res.status(500).json({ message: 'Error fetching public playlists', error });
    }
};


exports.deletePlaylist = async (req, res) => {
    console.log("deletePlaylist", req.user.userId);
    console.log("deletePlaylist req.user", req.user);
    const { playlistId } = req.body;

    if (!playlistId) {
        return res.status(400).json({ message: 'Please provide the playlist ID' });
    }

    try {
        // التأكد من أن البلاي ليست التي سيتم حذفها تخص المستخدم الحالي
        const playlist = await Playlist.findOne({
            _id: playlistId,
            createdBy: req.user.userId
        });

        // إذا لم يتم العثور على البلاي ليست أو إذا كانت لا تخص المستخدم
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found or does not belong to this user' });
        }

        // حذف البلاي ليست
        await Playlist.deleteOne({ _id: playlistId });

        res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        console.log('Error deleting playlist', error);
        res.status(500).json({ message: 'Error deleting playlist', error });
    }
};

// بتحذف اغنية وحدة 
exports.removeSongFromPlaylist = async (req, res) => {
    console.log("removeSongFromPlaylist", req.user.userId);
    console.log("removeSongFromPlaylist req.user", req.user);
    const { id } = req.params; // البلاي ليست المطلوبة
    const { songId } = req.body; // الأغنية التي سيتم حذفها

    try {
        const playlist = await Playlist.findById(id);

        if (!playlist) {
            console.log("id: ", id, 'Playlist not found');
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // تحقق من وجود الأغنية في البلاي ليست
        if (playlist.songs.includes(songId)) {
            console.log("song exist");
        } else {
            console.log("song not found", songId);
        }

        console.log("playlist.createdBy.toString() !== req.user.id",
            playlist.createdBy.toString(), req.user.userId, playlist.createdBy.toString() !== req.user.id,);
        // التأكد من أن اليوزر هو الذي أنشأ البلاي ليست أو أنه مسموح له بالتعديل
        if (playlist.createdBy.toString() !== req.user.userId && !playlist.allowEditing) {
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
            }).populate({
                path: 'createdBy',
                select: 'username profilePicture'  // جلب اسم وصورة اليوزر
            });

        res.json(updatedPlaylist);
    } catch (error) {
        console.log('Error removing song from playlist', error);
        res.status(500).json({ message: 'Error removing song from playlist', error });
    }
};




// بتضيف اغنية وحدة
exports.addSongToPlaylist = async (req, res) => {
    console.log("addSongToPlaylist", req.user.userId);
    console.log("addSongToPlaylist req.user", req.user);
    const { id } = req.params;
    const { songId } = req.body;

    console.log("id playlist ", id);
    console.log("songId", songId);
    try {
        const playlist = await Playlist.findById(id);

        if (!playlist) {
            console.log("Playlist not found");

            return res.status(404).json({ message: 'Playlist not found' });
        }

        // تحقق من وجود الأغنية في البلاي ليست
        if (playlist.songs.includes(songId)) {
            return res.status(400).json({ message: 'Song already exists in this playlist' });
        }

        console.log("playlist.createdBy.toString() !== req.user.id", playlist.createdBy.toString(), req.user.userId, playlist.createdBy.toString() !== req.user.id,);
        // التأكد من أن اليوزر هو الذي أنشأ البلاي ليست أو أنه مسموح له بالتعديل
        if (playlist.createdBy.toString() !== req.user.userId && !playlist.allowEditing) {
            console.log('Not allowed to edit this playlist');

            return res.status(403).json({ message: 'Not allowed to edit this playlist' });
        }

        playlist.songs.push(songId);

        await playlist.save();
        console.log("Saved");

        const updatedPlaylist = await Playlist.findById(id)
            .populate({
                path: 'songs',
                populate: {
                    path: 'artist',
                    select: 'name'
                }
            }).populate({
                path: 'createdBy',
                select: 'username profilePicture'  // جلب اسم وصورة اليوزر
            });

        res.json(updatedPlaylist);
    } catch (error) {
        console.log('Error adding song to playlist', error);

        res.status(500).json({ message: 'Error adding song to playlist', error });
    }
};


