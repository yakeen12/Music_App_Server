const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dzoscfkhd', // اسم الحساب
    api_key: '745797943657791',       // مفتاح API
    api_secret: '4UAK05MWnxP8_aYPTzvm8kEXwOQ', // المفتاح السري
});

module.exports = cloudinary;
