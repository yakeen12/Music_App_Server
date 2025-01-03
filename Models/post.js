const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    community: { type: String, required: true },  // اسم الكوميونيتي
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',  // ربط الأغنية
    },
    episode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ُEpisode',  // ربط البودكاست
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // يعبر عن المستخدمين الذين وضعوا لايك
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
