// ## Review APIs
// ### POST /books/:bookId/review
// - Add a review for the book in reviews collection.
// - Check if the bookId exists and is not deleted before adding the review. Send an error response with appropirate status code like [this](#error-response-structure) if the book does not exist
// - Get review details like review, rating, reviewer's name in request body.
// - Update the related book document by increasing its review count
// - Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like [this](#Review-Response-Structure)

const reviewModel = require('../model/reviewModel')
const bookModel = require('../model/bookModel');

const createReview = async function (req, res) {
    try {
        const bookId = req.params.bookId

        const data = req.body
        const bookData = await bookModel.findById(bookId)

        if(!bookData){
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }
        if(bookData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }

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



// ### PUT /books/:bookId/review/:reviewId
// - Update the review - review, rating, reviewer's name.
// - Check if the bookId exists and is not deleted before updating the review. Check if the review exist before updating the review. Send an error response with appropirate status code like [this](#error-response-structure) if the book does not exist
// - Get review details like review, rating, reviewer's name in request body.
// - Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like [this](#book-details-response)

const updateReview = async function (req, res) {
    try {
        const params = req.params
        const {bookId, reviewId} = params

        const data = req.body
        const bookData = await bookModel.findById(bookId)

        if(!bookData){
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }
        if(bookData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }

        const reviewData = await reviewModel.findById(reviewId)

        if(!reviewData){
            return res.status(404).send({ status: false, message: "No review found with the bookId" })
        }

        if(reviewData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
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


// ### DELETE /books/:bookId/review/:reviewId
// - Check if the review exist with the reviewId. Check if the book exist with the bookId. Send an error response with appropirate status code like [this](#error-response-structure) if the book or book review does not exist
// - Delete the related reivew.
// - Update the books document - decrease review count by one

const deleteReview = async function (req, res) {
    try {
        const params = req.params
        const {bookId, reviewId} = params

        const bookData = await bookModel.findById(bookId)

        if(!bookData){
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }
        if(bookData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
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