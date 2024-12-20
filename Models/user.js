const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    username: { type: String, required: true }, // is the userName unique???
    email: { type: String, required: true, unique: true },
    // search user by email in the database?
    password: { type: String, required: true },
    profilePicture: { type: String, default: '/default-profile.png' },
    // theme ?????????????
    likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],

    // for the community
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Posts the user has liked
    comments: [
        {
            post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
            text: String,
            createdAt: { type: Date, default: Date.now },
        },
    ], // Comments by the user


});
const User = mongoose.model('User', userSchema);
module.exports = User;