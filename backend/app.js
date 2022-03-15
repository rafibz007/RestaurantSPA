const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const app = express();
const auth = require('./middleware/auth')
require('dotenv/config')

// const jwt = require('jsonwebtoken')
// MIDDLEWARE
app.use(async (req, res, next) => {

    if (req.headers.origin)
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-access-token')

    // res.cookie("test", "test")
    // await jwt.sign({id:0}, "asd", {}, (err,token)=>{
    //     res.cookie("jwt", token)
    // })

    return next()
})


app.use((req, res, next) => {
    console.log(req.method + " " +req.url + " at " + new Date(Date.now()))
    return next()
})

app.use(bodyParser.json())
app.use(cookieParser())
// app.use(bodyParser.urlencoded())


// IMPORT ROUTES
const productsRoute = require('./routes/products')
const commentsRoute = require('./routes/comments')
const authRoute = auth.router
const userRoute = require('./routes/user')
const orderHistoryRoute = require('./routes/orderHistory')
const basketRoute = require('./routes/basket')
const ratingRoute = require('./routes/rating')

app.use('', authRoute)
app.use('/products', productsRoute)
app.use('/comments', commentsRoute)
app.use('/user', userRoute)
app.use('/history', orderHistoryRoute)
app.use('/basket', basketRoute)
app.use('/rating', ratingRoute)


// ROUTES
app.get('/', ((req, res) => {
    res.status(200).sendFile(__dirname + "/static/index.html")
}))


// CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION)
    .then(()=>{
        console.log("Connected successfully to DB")
    })
    .catch((err) => {
        console.log(`Connecting to DB failed \n ${err}`)
        process.exit(1)
    })


// START LISTENING
const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log("Listening on port: " + PORT)

});


app.get('/test', auth.verifyUser(['admin', 'client']), (req,res)=>{
    console.log(res.user)
    return res.status(200).send("you are logged in and allowed here")
})

app.get('/with', (req, res) => {
    res.cookie("with", "with")
    return res.send()
})
app.get('/without', (req, res) => {
    res.cookie("without", "without")
    return res.json({dlaczego:"nie-dziala"})
})