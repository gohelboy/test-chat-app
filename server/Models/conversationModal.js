const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        senderName: { type: String, required: true },
        content: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
