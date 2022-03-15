const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const Basket = require('../modules/Basket')
const Product = require('../modules/Product')
const OrderHistory = require('../modules/OrderHistory')
const {verifyUser} = require("../middleware/auth");
const RoleEnum = require('../enums/Role')

//ORDER FOOD
// {basket:[{productId:-, amount:-, price:-}, ...]}
router.post('/', [verifyUser([RoleEnum.CLIENT]), async (req, res) => {
    try {

        if (!req.body.basket)
            return res.status(400).send("Wrong data")

        const serverBasket = JSON.parse(JSON.stringify(await Basket.find({userId:res.user._id})))
        const userBasket = req.body.basket
        const products = JSON.parse(JSON.stringify(await Product.find()))
        const order = []
        const date = new Date(Date.now())

        if (serverBasket.length !== userBasket.length)
            return res.status(409).send({ordered:false, message:"Server information do not match your data. Need to reload."})

        for (let userBasketItem of userBasket){
            let serverBasketCounterpart = serverBasket.find(item => item.dishId === userBasketItem.dishId)
            let product = products.find(item => item.dishId === userBasketItem.dishId)
            if (!serverBasketCounterpart || userBasketItem.amount !== serverBasketCounterpart.amount || !product || userBasketItem.price !== product.price)
                return res.status(409).send({ordered:false, message:"Server information do not match your data. Need to reload."})

            order.push({dishId:serverBasketCounterpart.dishId, userId:res.user._id, amount:serverBasketCounterpart.amount, price:product.price, date:date})
        }

        await OrderHistory.insertMany(order)
        await Basket.deleteMany({userId:res.user._id})

        return res.status(202).send({ordered:true, message:"Ordered made successfully"})

    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
}])

//READ
router.get('/', [verifyUser([RoleEnum.CLIENT]),(req, res) => {
    try {

        Basket.find({userId:res.user._id}, {userId:0}, {}, (err, basket) => {
            if (err) return res.status(200).send([])
            return res.status(200).json(basket)
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
}])

//UPDATE
// {amount: ..., dishId: ...}
router.put('/', [verifyUser([RoleEnum.CLIENT]), async (req, res)=>{
    try {
        if (!mongoose.isValidObjectId(req.body.dishId))
            return res.status(404).send("No product found with given ID")

        const product = await Product.findById(req.body.dishId)
        if (product === null)
            return res.status(404).send("No product found with given ID")

        if (req.body.amount === undefined || req.body.amount < 0)
            return res.status(400).send("Wrong data")



        const record = await Basket.findOne({dishId:req.body.dishId, userId:res.user._id})
        // console.log(record)
        let allRecords = await Basket.find({dishId:req.body.dishId})
        let previousAmount = record ? record.amount : 0;
        let orderedSum = 0
        for (let orderRecord of allRecords)
            orderedSum += orderRecord.amount

        let currentAvailableServingAmount = product.maxServingAmount - orderedSum + previousAmount

        if (req.body.amount === 0){
            await Basket.findOneAndDelete({dishId:req.body.dishId, userId:res.user._id})

            return res.status(201).json({
                dishId: req.body.dishId,
                amount: 0,
                maxServingAmount:currentAvailableServingAmount
            })
        }

        let newRecord;
        if (record === null){
            newRecord = await Basket.create({
                dishId: req.body.dishId,
                userId: res.user._id,
                amount: Math.min(req.body.amount, currentAvailableServingAmount)
            })
        } else {
            newRecord = await Basket.findOneAndUpdate({dishId:req.body.dishId, userId:res.user._id},
                {amount: Math.min(req.body.amount, currentAvailableServingAmount)},
                {runValidators:true, new:true})
        }

        // console.log(newRecord)
        // console.log(record)

        return res.status(201).json({
            dishId: req.body.dishId,
            amount: newRecord.amount,
            maxServingAmount:product.maxServingAmount-orderedSum+previousAmount
        })


    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
}])

module.exports = router