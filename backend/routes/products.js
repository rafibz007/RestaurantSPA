const express = require('express')
const router = express.Router()
const Product = require('../modules/Product')
const Comment = require('../modules/Comment')
const Basket = require('../modules/Basket')
const Rating = require('../modules/Rating')
const OrderHistory = require('../modules/OrderHistory')
const mongoose = require("mongoose");
const {verifyUser} = require("../middleware/auth");
const RoleEnum = require('../enums/Role')

// CREATE
router.post('/', [verifyUser([RoleEnum.MANAGER]),async (req, res) => {
    try {
        const body = req.body
        let validationFailed = false
        let savedProduct = await Product.create(body)
            .catch(err => {
                if (err){
                    res.status(400).send("Data validation failed")
                    validationFailed = true
                }
            })
        if (validationFailed)
            return

        savedProduct = JSON.parse(JSON.stringify(savedProduct))

        savedProduct.userRating = null
        savedProduct.selectedAmount = 0
        savedProduct.amountOfRatings = 0
        savedProduct.rating = 0

        res.status(201).json(savedProduct)

    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])



// READ
router.get('/', [verifyUser([RoleEnum.EVERYONE]), async (req, res) => {
    try {
        const products = JSON.parse(JSON.stringify(await Product.find()))

        for (let index in products){
            let product = products[index]
            product = JSON.parse(JSON.stringify(product))

            const userRelatedDetails = await getUserRelatedProductDetails(product._id, res.user)
            product.rating = userRelatedDetails.rating
            product.userRating = userRelatedDetails.userRating
            product.amountOfRatings = userRelatedDetails.amountOfRatings
            product.selectedAmount = userRelatedDetails.selectedAmount
            product.maxServingAmount = product.maxServingAmount - await getAmountOfReservedProducts(product._id) + userRelatedDetails.selectedAmount

            products[index] = product
        }

        // console.log(products)
        res.status(200).json(products)
    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])

router.get('/:id', [verifyUser([RoleEnum.EVERYONE]) ,async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)){
            res.status(200).send([])
            return
        }

        let product = JSON.parse(JSON.stringify(await Product.findById( req.params.id )))
        console.log(product)
        if (product !== null) {

            const userRelatedDetails = await getUserRelatedProductDetails(product._id, res.user)
            product.rating = userRelatedDetails.rating
            product.userRating = userRelatedDetails.userRating
            product.amountOfRatings = userRelatedDetails.amountOfRatings
            product.selectedAmount = userRelatedDetails.selectedAmount
            product.maxServingAmount = product.maxServingAmount - await getAmountOfReservedProducts(product._id) + userRelatedDetails.selectedAmount

            res.status(200).json(product)
        } else
            res.status(200).send([])

    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])

// UPDATE
router.put('/:id', [verifyUser([RoleEnum.MANAGER]), async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)){
            res.status(404).send("No product found with given ID")
            return
        }

        const body = req.body
        let validationFailed = false
        const product = await Product.findByIdAndUpdate(req.params.id, {$set : body},
            {new:true, runValidators:true}).lean()
            .catch(err =>{
                if (err){
                    res.status(400).send("Data validation failed")
                    validationFailed = true
                }
            })
        if (validationFailed)
            return


        if (product !== null) {
            const userRelatedDetails = await getUserRelatedProductDetails(product._id, res.user)
            product.rating = userRelatedDetails.rating
            product.userRating = userRelatedDetails.userRating
            product.amountOfRatings = userRelatedDetails.amountOfRatings
            product.selectedAmount = userRelatedDetails.selectedAmount
            product.maxServingAmount = product.maxServingAmount - await getAmountOfReservedProducts(product._id) + userRelatedDetails.selectedAmount
        } else
            res.status(404).send("No product found with given ID")
    } catch (err){
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])

// DELETE
router.delete('/:id', [verifyUser([RoleEnum.MANAGER]),async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)){
            res.status(404).send("No product found with given ID")
            return
        }

        const product = await Product.findByIdAndDelete(req.params.id).lean()
        if (product !== null){
            await Comment.deleteMany({dishId:req.params.id})
            await OrderHistory.deleteMany({dishId:req.params.id})
            await Basket.deleteMany({dishId:req.params.id})

            product.userRating = null
            product.selectedAmount = 0
            product.amountOfRatings = 0
            product.rating = 0
            product.maxServingAmount = 0
            res.status(200).json(product)
        } else
            res.status(404).send("No product found with given ID")
    } catch (err){
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}])

async function getUserRelatedProductDetails(productId, user){
    const productRatings = JSON.parse(JSON.stringify(await Rating.find({dishId:productId})))
    let amountOfRatings = productRatings.length

    let ratingSum = 0
    for (let rating of productRatings)
        ratingSum += rating.rating

    let rating = ratingSum / (productRatings.length > 0 ? productRatings.length : 1)

    let userRating;
    let selectedAmount;
    if (!user) {
        userRating = null
        selectedAmount = 0
    } else {
        let userRatings = await Rating.findOne({userId:user._id, dishId:productId})
        let userSelectedAmount = await Basket.findOne({userId:user._id, dishId:productId})
        // console.log(userRatings)
        // console.log(userSelectedAmount)
        userRating = userRatings ? userRatings.rating : null
        selectedAmount = userSelectedAmount ? userSelectedAmount.amount : 0
    }
    return {
        userRating:userRating,
        selectedAmount:selectedAmount,
        rating:rating,
        amountOfRatings:amountOfRatings
    }
}

async function getAmountOfReservedProducts(dishId){
    // zeby uwzgledniac zlozone zamowienia, to trzeba byloby jeszcze odejmowac ilosc
    // zlozonych zamowien na kazde danie danego dnia
    const reservedDishes = await Basket.find({dishId:dishId})
    let sum = 0
    for (let dish of reservedDishes) {
        // console.log(dish)
        sum += dish.amount
    }
    return sum
}

module.exports = router