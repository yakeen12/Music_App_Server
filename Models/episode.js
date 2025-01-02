const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
    podcast: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Podcast'
    },
    title: String,
    episodeNumber: Number,
    description: String,
    audioUrl: String,
});





const Episode = mongoose.model('Episode', episodeSchema);
module.exports = Episode;
