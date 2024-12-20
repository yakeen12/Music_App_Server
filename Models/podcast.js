const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
    title: String,
    host: String,
    genre: { type: [String], required: true },
    description: String,
    episodes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Episode'
    }]
});

const Podcast = mongoose.model('Podcast', podcastSchema);
module.exports = Podcast;