const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const Rating = require('../modules/Rating')
const OrderHistory = require('../modules/OrderHistory')
const {verifyUser} = require("../middleware/auth");
const RoleEnum = require('../enums/Role')
const Basket = require("../modules/Basket");

//CREATE
//implemented in update

//UPDATE
router.put('/:productId', [verifyUser([RoleEnum.CLIENT], false), async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.productId))
            return res.status(404).send("No product found with given ID")

        if (!req.body.rating || !(req.body.rating >= 0 && req.body.rating <= 5))
            return res.status(400).send("Wrong data")

        // const previousOrders =  JSON.parse(JSON.stringify(await OrderHistory.find({userId:res.user._id, dishId:req.params.productId})))
        // if (previousOrders.length === 0)
        //     return res.status(400).send("You need to order dish before rating it")

        const reservedDishes = JSON.parse(JSON.stringify(await Basket.find({userId:res.user._id, dishId:req.params.productId})))
        if (reservedDishes.length === 0)
            return res.status(400).send("You need to reserve dish before commenting it")

        const rate = await Rating.findOne({dishId:req.params.productId, userId:res.user._id})
        if (rate === null){
            let ValidationFailed = false

            const newRating = await Rating.create({
                dishId:req.params.productId,
                userId:res.user._id.toString(),
                rating:req.body.rating
            })
                .catch(err => {
                    if (err){
                        ValidationFailed = true
                        return res.status(400).send({rated:false, error:"Data validation failed"})
                    }
                })
            if (ValidationFailed)
                return


            const calculatedRating = await calculateDishRating(req.params.productId)
            return res.status(201).send({rated:true,userRating:newRating.rating, rating:calculatedRating.rating, ratingsAmount:calculatedRating.amountOfRatings})

        } else {
            Rating.findOneAndUpdate({dishId:req.params.productId, userId:res.user._id},
                {rating:req.body.rating},
                {new:true, runValidators:true},
                async (err, newRating)=>{
                    if (err) return res.status(400).send({rated:false, error:"Data validation failed"})
                    const calculatedRating = await calculateDishRating(req.params.productId)
                    return res.status(201).send({rated:true,userRating:newRating.rating, rating:calculatedRating.rating, ratingsAmount:calculatedRating.amountOfRatings})
                })
        }

    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
}])

async function calculateDishRating(dishId){
    let allRatings = JSON.parse(JSON.stringify(await Rating.find({dishId:dishId})))
    let amount = allRatings.length
    let sum = 0
    for (let rate of allRatings)
        sum += rate.rating
    return {
        rating:sum/amount,
        amountOfRatings:amount
    }
}

module.exports = router