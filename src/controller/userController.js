const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken')
const validator = require('../util/validator')

require('dotenv').config()
const {SECRET_KEY} = process.env

const registerUser = async function (req, res) {
    try {
        const userData = req.body
        const {title,name,phone,email,password} = userData

        if(!validator.isValidRequestBody(userData)){
            return res.status(400).send({ status: false, message : "Enter data in body" })
        }

        // title: {string, mandatory, enum[Mr, Mrs, Miss]}
        let enm =[Mr, Mrs, Miss]
        if(!title){
            return res.status(400).send({ status: false, message : "title is required" })
        }

        if(!validator.isValid(title) || !enm.includes(title)){
            return res.status(400).send({status: false, message : "enter valid title"})
        }

        //   name: {string, mandatory},
        if(!name){
            return res.status(400).send({ status: false, message : "name is required" })
        }

        if(!validator.isValid(name)){
            return res.status(400).send({status: false, message : "enter valid name"})
        }

        //   phone: {string, mandatory, unique},
        if(!phone){
            return res.status(400).send({ status: false, message : "phone is required" })
        }

        if(!validator.isValid(phone) || !validator.isValidMobileNum(phone)){
            return res.status(400).send({status: false, message : "enter valid phone"})
        }

        const phoneNum = await userModel.findOne({phone : phone})
        if(phoneNum) {
            return res.status(400).send({status: false, message : "Phone number is already registered"})
        }

        //   email: {string, mandatory, valid email, unique}, 
        if(!email){
            return res.status(400).send({ status: false, message : "email is required" })
        }

        if(!validator.isValid(email) || !validator.isValidEmail(email)){
            return res.status(400).send({status: false, message : "enter valid email"})
        }

        const isEmail = await userModel.findOne({email : email})

        if(isEmail) {
            return res.status(400).send({status: false, message : "email is already registered"})
        }

        //   password: {string, mandatory, minLen 8, maxLen 15},
        if(!password){
            return res.status(400).send({ status: false, message : "password is required" })
        }

        if(!validator.isValid(password) || password.length<8 || password.length>15){
            return res.status(400).send({status: false, message : "enter valid password"})
        }

       

        const createUser = await userModel.create(userData)
        const {__v, ...user} = createUser._doc
        return res.status(201).send({ status: true, data: user })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const userLogin = async function (req, res) {
    try {
        const userCredential = req.body;
        const {email, password} = userCredential

        //   email: {string, mandatory, valid email, unique}, 
        if(!email){
            return res.status(400).send({ status: false, message : "email is required" })
        }

        if(!validator.isValid(email) || !validator.isValidEmail(email)){
            return res.status(400).send({status: false, message : "enter valid email"})
        }

        //   password: {string, mandatory, minLen 8, maxLen 15},
        if(!password){
            return res.status(400).send({ status: false, message : "password is required" })
        }

        if(!validator.isValid(password) || password.length<8 || password.length>15){
            return res.status(400).send({status: false, message : "enter valid password"})
        }

        const validUser = await userModel.findOne({email : email, password : password})
        if(!validUser){
            return res.status(401).send({ status: true, message : "Enter valid user credentials, email or password is wrong" })
        }
        const token = jwt.sign({userId : validUser._id, exp : 864000000000},SECRET_KEY)

        return res.status(200).send({ status: true, token : token })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { registerUser, userLogin }