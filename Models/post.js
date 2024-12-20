const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }, // Content 
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: false },
    podcast: { type: mongoose.Schema.Types.ObjectId, ref: 'Podcast', required: false },
    //community?
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
