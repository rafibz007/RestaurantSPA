const mongoose = require('mongoose')

const orderHistorySchema = new mongoose.Schema({
    dishId : {
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    date : {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('orderHistory', orderHistorySchema)