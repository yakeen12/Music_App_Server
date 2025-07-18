const SecretGift = require('../Models/secret_gift');
const User = require('../Models/user');
const Song = require('../Models/song');


// Send a secret gift
exports.sendSecretGift = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { receiverId, songList, content } = req.body;

    try {
        // Check if the receiver exists
        const receiver = await User.findById(receiverId);
        console.log(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Check if the songs exist in the database
        const songs = await Song.find({ '_id': { $in: songList } });
        if (songs.length !== songList.length) {
            return res.status(400).json({ message: 'Some songs not found' });
        }

        // Create a new SecretGift document
        const secretGift = new SecretGift({
            receiver: receiverId,
            songList: songList,
            content: content
        });

        // Save the secret gift to the database
        await secretGift.save();

        res.status(201).json({
            message: 'Secret gift sent successfully',
            secretGift,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};



// Get all secret gifts received by the logged-in user
exports.getReceivedGifts = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const receiverId = req.user.userId;

    try {
        const receivedGifts = await SecretGift.find({ receiver: receiverId })
            .populate({                                          // Populate song titles and artists
                path: 'songList',
                populate: { path: 'artist', select: 'name' }
            });
        res.status(200).json(receivedGifts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};
