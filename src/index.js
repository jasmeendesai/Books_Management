const express = require('express');
const mongoose = require('mongoose')
const route = require('./route/route')

const multer = require('multer')

require('dotenv').config()
const app = express()
const {PORT, MONGODB_STRING} = process.env

app.use(express.json());
app.use(express.urlencoded({extended : true}))

app.use(multer().any())

mongoose.connect(MONGODB_STRING,{
    useNewUrlParser : true
}).then(()=> console.log("MongoDB is Connected"))
.catch((error) => console.log(error))

app.use('/',route)

app.listen(PORT, ()=>{
    console.log(`Express app is ruuning on port ${PORT}`)
})