const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    roleID:{
        type: String,
        required:true,
        unique:true,
        dropDups:true
    },
    name:{
        type:String,
        required:true,
        unique:true,
        dropDups:true
    }
})

module.exports = mongoose.model('Role', roleSchema)