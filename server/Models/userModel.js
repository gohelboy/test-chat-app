const { Schema, default: mongoose } = require('mongoose');


const userSchema = new Schema({
    username: { type: String },
    socketID: { type: String, unique: true },
})

exports.userModel = mongoose.model('user', userSchema);

