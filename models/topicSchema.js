const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    creator_email: {
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
})

module.exports = mongoose.model('topicSchema', topicSchema)