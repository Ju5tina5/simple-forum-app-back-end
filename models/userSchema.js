const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    user_avatar: {
        type: String,
        required: true,
        default: 'https://gladstoneentertainment.com/wp-content/uploads/2018/05/avatar-placeholder.gif',
    },
    register_date: {
        type: Number,
        required: true,
        default: Date.now()
    },
    newActivity: {
        type: Array,
        required: false
    }
})

module.exports = mongoose.model('userSchema', userSchema)