const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discussionSchema = new Schema({
    creator_username: {
        type: String,
        required: true
    },
    topic_name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true,
    },
    unique_token: {
        type: String,
        required: true
    },
    post_count: {
        type: Number,
        required: true,
        default: 0
    },
    lastModified: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('discussionSchema', discussionSchema)