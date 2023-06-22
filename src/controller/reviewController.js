const reviewModel = require('../model/reviewModel')
const bookModel = require('../model/bookModel');

const createReview = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const data = req.body
        const {reviewedBy,rating,review} = data

        if (!validator.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Enter data in body" })
        }

        // bookId: {ObjectId, mandatory, refs to book model},
        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is required" })
        }
        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "bookId is not a valid Object Id" })
        }
        const bookData = await bookModel.findById(bookId)

        if(!bookData){
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }
        if(bookData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }
        data.bookId = bookId

        // reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
        if (!reviewedBy) {
            return res.status(400).send({ status: false, message: "reviewedBy is required" })
        }

        if (!validator.isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: "enter valid reviewedBy" })
        }
        
        // rating: {number, min 1, max 5, mandatory},
        if (!rating) {
            return res.status(400).send({ status: false, message: "rating is required" })
        }

        if (typeof rating !== "number" || rating > 5) {
            return res.status(400).send({ status: false, message: "enter valid reviews" })
        }
        
        // review: {string, optional}
        if (!validator.isValid(review)) {
            return res.status(400).send({ status: false, message: "enter valid review" })
        }

        data.reviewedAt = new Date()
        const createdata = await reviewModel.create(data)

        const updateBook = await bookModel.findOneAndUpdate({_id : bookId}, {$inc : {reviews :1}},{new : true})

        // updatedBook.reviewsData = createdata
        const updatedBook = {...updateBook._doc}
        updatedBook.reviewsData = createdata

        return res.status(200).send({ status: true, data : updatedBook })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const updateReview = async function (req, res) {
    try {
        const params = req.params
        const {bookId, reviewId} = params

        const data = req.body
        const {review, rating, reviewedBy} = data
        if (!validator.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Enter data in body" })
        }

        //bookId validation
        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "bookId is not a valid Object Id" })
        }

        const bookData = await bookModel.findById(bookId)

        if(!bookData){
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }
        if(bookData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }

        //reviewId validation
        if (!validator.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "reviewId is not a valid Object Id" })
        }
        const reviewData = await reviewModel.findById(reviewId)

        if(!reviewData){
            return res.status(404).send({ status: false, message: "No review found with the bookId" })
        }

        if(reviewData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }

        //review validation
        if(review){
            if(!isValid(review)) return res.status(400).send({status: false,
                message: "Please provide valid review for this book"})
        }
        //rating validation
        if(rating){
            if (typeof rating !== "number" || rating > 5) {
                return res.status(400).send({ status: false, message: "enter valid reviews" })
            }
        }
        // reviewedBy validation
        if(reviewedBy){
            if(!isValid(reviewedBy)) return res.status(400).send({status: false,
                message: "Please provide valid name "})
        }

        await reviewModel.findOneAndUpdate({_id : reviewId},data,{new : true})

        const reviewsData = await reviewModel.find({bookId : bookId})

        const BookData = {...bookData._doc}
        BookData.reviewsData = reviewsData

        return res.status(200).send({ status: true, data : BookData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const deleteReview = async function (req, res) {
    try {
        const params = req.params
        const {bookId, reviewId} = params

        //bookId validation
        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "bookId is not a valid Object Id" })
        }
        const bookData = await bookModel.findById(bookId)

        if(!bookData){
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }
        if(bookData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }

        //reviewId validation
        if (!validator.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "reviewId is not a valid Object Id" })
        }
        const reviewData = await reviewModel.findById(reviewId)

        if(!reviewData){
            return res.status(404).send({ status: false, message: "No review found with the bookId" })
        }

        if(reviewData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }

        await reviewModel.findOneAndUpdate({_id : reviewId},{isDeleted : true, deletedAt : new Date()})

        const updatebookData = await bookModel.findOneAndUpdate({_id : bookId},{$inc : {reviews :-1}},{new : true})

        return res.status(200).send({ status: true, data : updatebookData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = {createReview, updateReview, deleteReview}