const express = require('express');
const router = express.Router()

const userController = require('../controller/userController')

const bookController = require('../controller/bookController')

const reviewController = require('../controller/reviewController')

const {Authentication,Authorisation} = require('../middleware/middleware')

//================================================

//User Api
// POST /register
router.post('/register', userController.registerUser)

// POST /login
router.post('/login', userController.userLogin)

//========================================================

// Books API
// POST /books
router.post('/books',Authentication, bookController.createBook)

// GET /books
router.get('/books',Authentication,bookController.getBookByQuery)

// GET /books/:bookId
router.get('/books/:bookId',Authentication,bookController.getBookById)

// PUT /books/:bookId
router.put('/books/:bookId',Authentication,Authorisation,bookController.updateBookById)

// DELETE /books/:bookId
router.delete('/books/:bookId',Authentication,Authorisation,bookController.deleteBookById)

//==============================================================

// Review APIs
// POST /books/:bookId/review
router.post('/books/:bookId/review',reviewController.createReview)

// PUT /books/:bookId/review/:reviewId
router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)

// DELETE /books/:bookId/review/:reviewId
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)

//==============================================================================
router.use('*',(req, res) =>{
    res.status(400).send("Invalid url request");
})

module.exports = router