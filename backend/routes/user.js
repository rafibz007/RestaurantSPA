const express = require('express')
const router = express.Router()
const Product = require('../modules/Product')
const Comment = require('../modules/Comment')
const User = require('../modules/User')
const Basket = require('../modules/Basket')
const Rating = require('../modules/Rating')
const OrderHistory = require('../modules/OrderHistory')
const mongoose = require("mongoose");
const {verifyUser, _} = require('../middleware/auth')
const RoleEnum = require('../enums/Role')

// CREATE
// defined in auth.js as post /register

// READ
router.get('/', [verifyUser([RoleEnum.ADMIN]), async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])

router.get('/:id', [verifyUser([RoleEnum.ADMIN, RoleEnum.CLIENT]), async (req, res) => {
    try {
        if ( !((res.user && res.user._id === req.params.id) || (res.user && res.user.rolesIDs.includes(RoleEnum.ADMIN_ID))) )
            return res.status(401).send({auth:false, message: "You are not allowed to be here"})

        if (!mongoose.isValidObjectId(req.params.id)){
            res.status(200).send(null)
            return
        }

        let user = await User.findById( req.params.id )
        if (user !== null) {
            res.status(200).json(user)
        } else
            res.status(200).send([])

    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])

// UPDATE
router.put('/:id', [verifyUser([RoleEnum.ADMIN, RoleEnum.CLIENT]), async (req, res) => {
    try {
        if ( !((res.user && res.user._id === req.params.id) || (res.user && res.user.rolesIDs.includes(RoleEnum.ADMIN_ID))) )
            return res.status(401).send({auth:false, message: "You are not allowed to be here"})

        if (!mongoose.isValidObjectId(req.params.id)){
            res.status(404).send("No user found with given ID")
            return
        }

        if (!res.user.rolesIDs.includes(RoleEnum.ADMIN_ID)) {
            req.body.isBanned = undefined
            req.body.rolesIDs = undefined
        }


        const body = req.body
        console.log(body)
        const user = await User.findByIdAndUpdate(req.params.id, {$set : body},
            {new:true, runValidators:true}).lean()
            .catch(err =>{
                if (err){
                    return res.status(400).send("Data validation failed")
                }
            })

        if (user !== null) {
            res.status(200).json(user)
        } else
            res.status(404).send("No user found with given ID")
    } catch (err){
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])

// DELETE
router.delete('/:id', [verifyUser([RoleEnum.ADMIN, RoleEnum.CLIENT]), async (req, res) => {
    try {
        if ( !((res.user && res.user._id === req.params.id) || (res.user && res.user.rolesIDs.includes(RoleEnum.ADMIN_ID))) )
            return res.status(401).send({auth:false, message: "You are not allowed to be here"})

        if (!mongoose.isValidObjectId(req.params.id)){
            res.status(404).send("No user found with given ID")
            return
        }

        const user = await User.findByIdAndDelete(req.params.id)
        if (user !== null){
            await Comment.deleteMany({userId:req.params.id})
            await Basket.deleteMany({userId:req.params.id})
            await Rating.deleteMany({userId:req.params.id})
            await OrderHistory.deleteMany({userId:req.params.id})

            res.status(200).json(user)
        } else
            res.status(404).send("No user found with given ID")
    } catch (err){
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])


module.exports = router