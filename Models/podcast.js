const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
    title: String,
    host: String,
    description: String,
    img: { type: String, required: true }, // رابط الأغنية الصوتية
    episodes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Episode'
    }]
});

const Podcast = mongoose.model('Podcast', podcastSchema);
module.exports = Podcast;