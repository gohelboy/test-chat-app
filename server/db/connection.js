const mongo = require('mongoose');

const connection = mongo.connect('mongodb://localhost:27017/chat')

module.exports = connection