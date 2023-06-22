const bookModel = require('../model/bookModel');
const userModel = require('../model/userModel');
const reviewModel = require('../model/reviewModel')
const validator = require('../util/validator')


const createBook = async function (req, res) {
    try {
        const bookData = req.body


        const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = bookData

        if (!validator.isValidRequestBody(userData)) {
            return res.status(400).send({ status: false, message: "Enter data in body" })
        }

        // title: {string, mandatory, unique},

        if (!title) {
            return res.status(400).send({ status: false, message: "title is required" })
        }

        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: "enter valid title" })
        }

        const istitle = await bookModel.findOne({ title: title })
        if (!istitle) {
            return res.status(400).send({ status: false, message: "title is already present" })
        }

        //  excerpt: {type : String,trim : true, required : true}
        if (!excerpt) {
            return res.status(400).send({ status: false, message: "excerpt is required" })
        }
        if (!validator.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "enter valid excerpt" })
        }


        //     userId: {ObjectId, mandatory, refs to user model},
        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required" })
        }
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userId is not valid ObjectId" })
        }

        //     ISBN: {string, mandatory, unique},
        if (!ISBN) {
            return res.status(400).send({ status: false, message: "ISBN is required" })
        }

        if (!validator.isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "enter valid ISBN" })
        }

        const isISBN = await bookModel.findOne({ ISBN: ISBN })
        if (!isISBN) {
            return res.status(400).send({ status: false, message: "ISBN is already present" })
        }

        //     category: {string, mandatory},
        if (!category) {
            return res.status(400).send({ status: false, message: "category is required" })
        }

        if (!validator.isValid(category)) {
            return res.status(400).send({ status: false, message: "enter valid category" })
        }

        //     subcategory: {string, mandatory},
        if (!subcategory) {
            return res.status(400).send({ status: false, message: "subcategory is required" })
        }

        if (!validator.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "enter valid subcategory" })
        }
     

        //     releasedAt: {Date, mandatory, format("YYYY-MM-DD")},
        if (!releasedAt) {
            return res.status(400).send({ status: false, message: "releasedAt is required" })
        }
        const dateFormat = /^\d{4}-\d{2}-\d{2}$/
        if (!validator.isValid(releasedAt) || !dateFormat.test(releasedAt)) {
            return res.status(400).send({ status: false, message: "enter valid release date" })
        }


        let userLoggedin = req.decodedToken
        const userToBeModified = userId

        if (userToBeModified !== userLoggedin) {
            return res.status(403).send({ status: false, message: "Unauthorised user" })
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ status: false, message: "User is not found" })
        }
        const createBook = await bookModel.create(bookData)

        const { __v, ...book } = createBook._doc

        return res.status(201).send({ status: true, data: book })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getBookByQuery = async function (req, res) {
    try {
        const filter = req.query

        filter.isDeleted = false
        const bookData = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

        if (bookData.length === 0) {
            return res.status(404).send({ status: false, message: "No book found with the filter" })
        }
        return res.status(200).send({ status: true, message: 'Books list', data: bookData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const getBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "bookId is not a valid Object Id" })
        }

        const bookData = await bookModel.findById(bookId)

        if (!bookData) {
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }
        if (bookData.isDeleted) {
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }

        const reviewData = await reviewModel.find({ bookId: bookId, isDeleted: false })
        const { __v, ...books } = bookData._doc
        books.reviewData = reviewData;

        return res.status(200).send({ status: true, message: "BookList", data: books })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const updateBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const data = req.body
        const { title, excerpt, releasedAt, ISBN } = data

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "bookId is not a valid Object Id" })
        }

        if (!validator.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Enter data in body" })
        }

        // title validation
        if (title) {
            if (!validator.isValid(title)) {
                return res.status(400).send({ status: false, message: "enter valid title" })
            }
            const istitle = await bookModel.findOne({ title: title })
            if (!istitle) {
                return res.status(400).send({ status: false, message: "title is already present" })
            }
        }

        // excerpt validation
        if (excerpt) {
            if (!validator.isValid(excerpt)) {
                return res.status(400).send({ status: false, message: "enter valid excerpt" })
            }
        }

        // releasedAt validation
        if (releasedAt) {
            const dateFormat = /^\d{4}-\d{2}-\d{2}$/
            if (!validator.isValid(releasedAt) || !dateFormat.test(releasedAt)) {
                return res.status(400).send({ status: false, message: "enter valid release date" })
            }
        }


        // ISBN validation
        if (ISBN) {
            if (!validator.isValid(ISBN)) {
                return res.status(400).send({ status: false, message: "enter valid ISBN" })
            }
        }

        const isISBN = await bookModel.findOne({ ISBN: ISBN })
        if (!isISBN) {
            return res.status(400).send({ status: false, message: "ISBN is already present" })
        }


        const bookData = await bookModel.findById(bookId)

        if (!bookData) {
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }
        if (bookData.isDeleted) {
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }

        const updateData = await bookModel.findOneAndUpdate({ _id: bookId }, data, { new: true })

        return res.status(200).send({ status: true, message: "Updated data", data: updateData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const deleteBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const bookData = await bookModel.findById(bookId)

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "bookId is not a valid Object Id" })
        }

        if (!bookData) {
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }

        if (bookData.isDeleted) {
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }

        await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: new Date() }, { new: true })

        return res.status(200).send({ status: true, message: "The has been deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { createBook, getBookByQuery, getBookById, updateBookById, deleteBookById }