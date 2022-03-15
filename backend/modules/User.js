const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        dropDups:true
    },
    email:{
      type:String,
      required:true,
        unique:true,
        dropDups:true
    },
    passwordHash:{
        type:String,
        required:true,
        select:false
    },
    rolesIDs : {
        type : Array,
        default: ["2"]
    },
    isBanned:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('User', userSchema)