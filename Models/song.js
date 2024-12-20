const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true }, // عنوان الأغنية
    artist: { type: String, required: true }, // الفنان أو المؤدي
    genre: { type: String }, // نوع الأغنية مثل (Pop, Rock, Hip-hop)
    url: { type: String, required: true }, // رابط الأغنية الصوتية
    likes: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // المستخدمون الذين أعجبوا بالأغنية
    ],
});
 
const Song = mongoose.model('Song', songSchema);

module.exports = Song;
