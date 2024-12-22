const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true }, // عنوان الأغنية
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true }, // مرجع للفنان
    genre: { type: String }, // نوع الأغنية مثل (Pop, Rock, Hip-hop)
    url: { type: String, required: true }, // رابط الأغنية الصوتية
    likes: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // المستخدمون الذين أعجبوا بالأغنية
    ],
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
