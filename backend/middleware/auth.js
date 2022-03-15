const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../modules/User')
const Role = require('../modules/Role')
const bcrypt = require('bcryptjs')
const router = express.Router()
require('dotenv/config')
const OrderHistory = require("../modules/OrderHistory");
const RoleEnum = require('../enums/Role')

const AUTH_COOKIE_NAME = "x-access-token"

// ALLOWING ROLE:
// admin - "admin"
// manager - "manager"
// client - "client"
// everyone - "*"
function verifyUser(allowedRoles, allowBannedUser=true){
    return async function (req, res, next) {

        const allRoles = await Role.find()
        const roleIDs = new Map()
        for (let role of allRoles){
            if (!(role['name'] && role['roleID']))
                continue

            roleIDs.set(role['name'], role['roleID'])
        }

        const token = req.headers[AUTH_COOKIE_NAME]

        if (!token && !allowedRoles.includes(RoleEnum.EVERYONE))
            return res.status(401).send({auth:false, message: "You are not allowed to be here"})

        if (!token && allowedRoles.includes(RoleEnum.EVERYONE))
            return next()

        jwt.verify(token, process.env.JWT_SECRET, {},async (err, decoded) => {
            if (err) return res.status(401).send({auth:false, message: "You are not allowed to be here"})


            User.findById(decoded._id, {},{}, (err, user) => {
                if (err) return res.status(500).send({auth:false, message:"Something went wrong"})
                if (!user) return res.status(401).send({auth:false, message:"Failed to authenticate"})

                let isAllowed = false
                for (let allowedRole of allowedRoles){
                    if (user.rolesIDs.includes(roleIDs.get(allowedRole))){
                        isAllowed = true
                        break
                    }
                }

                if (allowedRoles.includes(RoleEnum.EVERYONE))
                    isAllowed = true

                if (user && user.isBanned && !allowBannedUser)
                    isAllowed = false

                if (isAllowed){
                    res.user = user
                    return next()
                } else
                    return res.status(401).send({auth:false, message: "You are not allowed to be here"})
            })
        })
    }
}

router.post('/login', async (req, res, next) => {
    try {
        // const token = req.headers[AUTH_COOKIE_NAME]
        // if (token) return res.status(200).send({login:true, message:"Logged in successfully"})

        const body = req.body
        if (!((body.username || body.email) && body.password))
            return res.status(400).send({login:false, message:"Invalid data"})

        const username = body.username
        const email = body.email
        const password = body.password
        // console.log(username, email, password)
        User.findOne({$or: [{username: username}, {email: email}]},{passwordHash:1, _id:1, username:1, email:1, rolesIDs:1, isBanned:1},{}, async (err, user)=>{
            if (err) return res.status(500).send("Something went wrong")
            if (!user) return res.status(401).send({login:false, message:"Invalid data"})

            // console.log(user)
            if (!bcrypt.compare(password, user.passwordHash))
                return res.status(401).send({login:false, message:"Invalid data"})

            const hours = 2
            await jwt.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn: hours*60}, async (err, token)=>{
                if (err)
                    return res.status(500).send({login:false, message:"Something went wrong"})

                const history = await getUserOrderHistory(user._id)
                return res.status(200).json({login:true, message:"Logged in successfully", idToken: token, expiresIn:hours*3600, user:{
                        _id:user._id,
                        username:user.username,
                        email:user.email,
                        rolesIDs:user.rolesIDs,
                        isBanned:user.isBanned,
                        orderHistory:history
                    }})
            })
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
})

router.post('/register', async (req, res, next) => {
    try {
        const body = req.body
        if (!(body.username && body.email && body.password))
            return res.status(400).send({registration:false, error:"Invalid data"})

        const username = body.username
        const email = body.email
        const salt = bcrypt.genSaltSync(12)
        const passwordHash = bcrypt.hashSync(body.password, salt)

        const result = await User.findOne({$or:[
                {username:username},
                {email:email}
            ]})

        if (result)
            return res.status(400).send({registration:false, error:"Username or email already in use"})

        User.create({
            username: username,
            email: email,
            passwordHash: passwordHash
        }, (err, user)=>{
            if (err) return res.status(400).send({registration:false, error:"Data validation failed"})

            return res.status(201).send({registration:true, error:"New user registered"})
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
})

router.post('/logout', (req, res, next) => {
    try {

        // res.cookie('Authorization', '', {maxAge:0})
        res.clearCookie(AUTH_COOKIE_NAME)
        return res.status(200).send({logout:true,message:"Logged out successfully"})

    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
})

async function getUserOrderHistory(userId){
    const history = await OrderHistory.find({userId:userId}, {userId:0})
    return history
}

module.exports = { verifyUser, router, getUserOrderHistory }