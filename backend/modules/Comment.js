const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    dishId : {
        type: String,
        required: true,
    },
    name : {
        type: String,
        required: true,
    },
    userId : {
        type: String,
        required: true,
    },
    body : {
        type: String,
        required: true,
    },
    date : {
        type: String,
        required: false,
    },
})

module.exports = mongoose.model('Comments', commentSchema)