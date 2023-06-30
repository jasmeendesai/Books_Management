const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type : String,
        trim : true, 
        required : true,
        unique : true
    },
    excerpt: {
        type : String,
        trim : true, 
        required : true
    }, 
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    ISBN: {
        type : String,
        trim : true, 
        required : true,
        unique : true
    },
    category: {
        type : String,
        trim : true, 
        required : true  
    },
    subcategory: {
        type : String,
        trim : true, 
        required : true 
    },
    reviews: {
        type : Number, 
        default: 0
        // comment: 'Holds the number of reviews of this book'
    },
    deletedAt: {
        type : Date
    }, 
    isDeleted: {
        type : Boolean, 
        default: false
    },
    releasedAt: {
        type : Date, 
        required : true
    },
    Bookcover : String

},{timestamps : true})

module.exports = mongoose.model('Book', bookSchema)
