const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    //   bio: { type: String, required: false },
    image: { type: String, required: false },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }], // مرجع للأغاني
});

module.exports = mongoose.model('Artist', artistSchema);
