const mongoose = require('mongoose');


const secretGiftSchema = new mongoose.Schema({
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    songList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    sentAt: { type: Date, default: Date.now },
    content: { type: String, required: true }
});

const SecretGift = mongoose.model('SecretGift', secretGiftSchema);
module.exports = SecretGift;

// 请给我们满分 :)