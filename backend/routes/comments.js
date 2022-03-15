const express = require('express')
const router = express.Router()
const mongoose = require("mongoose");
const Product = require('../modules/Product')
const Comment = require('../modules/Comment')
const User = require('../modules/User')
const {verifyUser} = require("../middleware/auth");
const OrderHistory = require("../modules/OrderHistory");
const Basket = require("../modules/Basket");
const RoleEnum = require('../enums/Role')


// CREATE
router.post('/product/:id', [verifyUser([RoleEnum.CLIENT], false),async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id) || Product.findById(req.params.id)  === null){
            return res.status(404).send("No product with given ID")
        }

        // const previousOrders =  JSON.parse(JSON.stringify(await OrderHistory.find({userId:res.user._id, dishId:req.params.id})))
        // if (previousOrders.length === 0)
        //     return res.status(400).send("You need to order dish before commenting it")

        const reservedDishes = JSON.parse(JSON.stringify(await Basket.find({userId:res.user._id, dishId:req.params.id})))
        if (reservedDishes.length === 0)
            return res.status(400).send("You need to reserve dish before commenting it")

        const body = req.body
        let validationFailed = false
        const comment = await Comment.create({
            userId:res.user._id,
            dishId:req.params.id,
            body:body.body,
            name:body.name,
            date:body.date
        })
            .catch(err => {
                if (err){
                    res.status(400).send("Data validation failed")
                    validationFailed = true
                }
            })
        if (validationFailed)
            return

        res.status(201).json({
            _id:comment.id,
            dishId:comment.dishId,
            userId:comment.userId,
            body:comment.body,
            name:comment.name,
            date:comment.date,
            nick:res.user.username
        })
    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])



// READ
router.get('/', [verifyUser([RoleEnum.ADMIN]),async (req, res) => {
    try {
        let comments = JSON.parse(JSON.stringify(await Comment.find()))
        for (let index in comments){
            let comment = comments[index]

            let user = await User.findById(comment.userId)[0]
            comment.nick = user.username

            comments[index] = comment
        }
        res.status(200).json(comments)
    } catch (err){
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])

router.get('/:id', [verifyUser([RoleEnum.CLIENT, RoleEnum.MANAGER, RoleEnum.ADMIN]),async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)){
            res.status(200).send(null)
            return
        }

        let comment = await Comment.findById(req.params.id)[0]
        if (comment !== null) {
            let user = await User.findById(comment.userId)[0]
            comment.nick = user.username

            res.status(200).json(comment)
        }
        else
            res.status(404).send("No comment with given ID")
    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])

router.get('/product/:id', [verifyUser([RoleEnum.CLIENT, RoleEnum.MANAGER, RoleEnum.ADMIN]),async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)){
            res.status(200).send([])
            return
        }

        let comments = JSON.parse(JSON.stringify(await Comment.find({dishId:req.params.id})))
        if (comments !== null) {
            for (let index in comments){
                let comment = comments[index]

                let user = await User.findById(comment.userId)
                comment.nick = user.username
                comments[index] = comment
            }
            res.status(200).json(comments)
        }
        else
            res.status(200).send([])
    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])

router.get('/user/:id', [verifyUser([RoleEnum.CLIENT, RoleEnum.MANAGER, RoleEnum.ADMIN]),async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)){
            return res.status(200).send([])
        }

        let comments = JSON.parse(JSON.stringify(await Comment.find({userId:req.params.id})))
        if (comments !== null) {
            for (let index in comments){
                let comment = comments[index]

                let user = await User.findById(comment.userId)[0]
                comment.nick = user.username

                comments[index] = comment
            }
            res.status(200).json(comments)
        }
        else
            res.status(200).send([])
    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])

// UPDATE
router.put('/:id', [verifyUser([RoleEnum.CLIENT]),async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)){
            res.status(404).send("No comments with given ID")
            return
        }

        const body = req.body
        let validationFailed = false
        const comment = await Comment.findByIdAndUpdate(req.params.id, { $set : {
                name:body.name,
                body:body.body,
                date:body.date,
            }
        }, {new: true, runValidators: true})
            .catch(err =>{
                if (err){
                    res.status(400).send("Data validation failed")
                    validationFailed = true
                }
            })
        if (validationFailed)
            return

        if (comment !== null) {
            let user = await User.findById(comment.userId)[0]
            comment.nick = user.username
            res.status(200).json(comment)
        }
        else
            res.status(404).send("No comment with given ID")

    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])


// DELETE
router.delete('/:id', [verifyUser([RoleEnum.CLIENT, RoleEnum.ADMIN]),async (req, res) => {
    try {
        if ( !((res.user && res.user._id === req.params.id) || (res.user && res.user.rolesIDs.includes(RoleEnum.ADMIN_ID))) )
            return res.status(401).send({auth:false, message: "You are not allowed to be here"})

        if (!mongoose.isValidObjectId(req.params.id)){
            res.status(404).send("No comment found with given ID")
            return
        }

        let comment = await Comment.findByIdAndDelete(req.params.id)[0]
        if (comment !== null) {
            let user = await User.findById(comment.userId)[0]
            comment.nick = user.username
            res.status(200).json(comment)
        }
        else
            res.status(404).send("No comment found with given ID")
    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])


module.exports = router