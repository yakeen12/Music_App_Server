const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    username: { type: String, required: true }, // is the userName unique???
    email: { type: String, required: true, unique: true },
    // search user by email in the database?
    password: { type: String, required: true },
    profilePicture: { type: String, },
    // theme ?????????????
    likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],

    secretGifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SecretGift' }], // إضافة القائمة الجديدة
});
const User = mongoose.model('User', userSchema);
module.exports = User;