const mongoose = require('mongoose')

const basketSchema = new mongoose.Schema({
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
    }
})

basketSchema.index({dishId:1, userId:1}, {unique:true})
module.exports = mongoose.model('Basket', basketSchema)