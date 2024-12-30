const mongoose = require('mongoose');


const PlaylistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    allowEditing: { type: Boolean, default: false },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', PlaylistSchema);
