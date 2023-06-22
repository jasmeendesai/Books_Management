const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    title: {
        type : String,
        trim : true, 
        required : true,
        enum :["Mr", "Mrs", "Miss"]
    },
    name: {
        type : String, 
        trim : true,
        required : true
    },
    phone: {
        type : String, 
        trim : true,
        required : true, 
        unique : true,
        minLength: 9,
        maxLength: 10
    },
    email: { 
        type: String,
        required: true,
        unique: true,
        trim : true,
        validate: {
            validator: function(value) {
                // Regular expression to validate email format
                return  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value); 
            },
            message: 'Invalid email format'
      }
    },
    password: {
        type : String, 
        required : true,
        trim : true,
        minLength: 8,
        maxLength: 15
    },
    address: {
        street: String,
        city: String,
        pincode: String
    },

},{timestamps : true})

module.exports = mongoose.model('User', userSchema)