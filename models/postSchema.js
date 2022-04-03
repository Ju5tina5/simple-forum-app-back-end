const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    creator_username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true,
    },
    discussion_token: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('postSchema', postSchema)