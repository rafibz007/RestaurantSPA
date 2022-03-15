const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    dishId : {
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    }
})

// ratingSchema.index({productId:1, userId:1}, {unique:true})
module.exports = mongoose.model('Rating', ratingSchema)