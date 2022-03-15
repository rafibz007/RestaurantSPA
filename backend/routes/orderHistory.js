const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const OrderHistory = require('../modules/OrderHistory')
const {verifyUser} = require("../middleware/auth");
const RoleEnum = require('../enums/Role')

//READ
router.get('/:userId', [verifyUser([RoleEnum.CLIENT, RoleEnum.MANAGER, RoleEnum.ADMIN]), async (req, res)=>{
    try {
        if (!res.user.rolesIDs.includes(RoleEnum.ADMIN) && !res.user.rolesIDs.includes(RoleEnum.MANAGER_ID) && !req.params.userId === res.user._id)
            return res.status(401).send({auth:false, message: "You are not allowed to be here"})

        const history = await OrderHistory.find({userId:res.user._id}, {userId:0})
        return res.status(200).json(history)
    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }


}])

module.exports = router