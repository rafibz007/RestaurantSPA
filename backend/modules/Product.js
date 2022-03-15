const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    cuisine: {
        type: String,
        required : true
    },
    type: {
        type: String,
        required : true
    },
    category: {
        type: String,
        required : true
    },
    ingredients: {
        type: String,
        required : false
    },
    maxServingAmount: {
        type: Number,
        required : true
    },
    price: {
        type: Number,
        required : true
    },
    description: {
        type: String,
        required : false
    },
    imageLink: {
        type: Array,
        required : true
    },
})

module.exports = mongoose.model('Product', productSchema)