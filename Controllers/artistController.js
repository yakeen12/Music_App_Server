const Artist = require('../Models/artist');
const cloudinary = require('../Config/cloudinary');


// الحصول على فنان بواسطة ID
exports.getArtistById = async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id).populate('songs');
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        res.status(200).json(artist);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving artist', error });
    }
};


// إضافة فنان جديد مع صورة
exports.createArtist = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Artist name is required' });
        }

        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'artists', // اسم المجلد في Cloudinary
            });
            imageUrl = result.secure_url; // الحصول على رابط الصورة
        }

        const newArtist = new Artist({ name, image: imageUrl });
        await newArtist.save();

        res.status(201).json({ message: 'Artist created successfully', artist: newArtist });
    } catch (error) {
        res.status(500).json({ message: 'Error creating artist', error });
    }
};

// تعديل فنان موجود مع صورة جديدة (اختياري)
exports.updateArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        let imageUrl = updates.image; // الاحتفاظ بالصورة القديمة
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'artists', // اسم المجلد في Cloudinary
            });
            imageUrl = result.secure_url; // استبدال بالصورة الجديدة
        }

        const updatedArtist = await Artist.findByIdAndUpdate(
            id,
            { ...updates, image: imageUrl },
            { new: true }
        );

        if (!updatedArtist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        res.status(200).json({ message: 'Artist updated successfully', artist: updatedArtist });
    } catch (error) {
        res.status(500).json({ message: 'Error updating artist', error });
    }
};
