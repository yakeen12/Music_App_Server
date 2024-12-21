const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Config/cloudinary'); // استيراد إعداد Cloudinary

// إعداد التخزين
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-pfps', // اسم المجلد الذي سيتم تخزين الصور فيه
        allowed_formats: ['jpg', 'png', 'jpeg'], // صيغ الملفات المسموح بها
    },
});

// إعداد Multer
const upload = multer({ storage: storage });

module.exports = upload;
