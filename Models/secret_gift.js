const mongoose = require('mongoose');

const secretGiftSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    songList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    sentAt: { type: Date, default: Date.now },
});

const SecretGift = mongoose.model('SecretGift', secretGiftSchema);
module.exports = SecretGift;
