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

//=============
router.post('/createUrl',bookController.createUrl)


//==============================================================

// Review APIs
// POST /books/:bookId/review
router.post('/books/:bookId/review',reviewController.createReview)

// PUT /books/:bookId/review/:reviewId
router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)

// DELETE /books/:bookId/review/:reviewId
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)


//=============================================================================


// aws.config.update({
//     accessKeyId: "AKIAY3L35MCRZNIRGT6N",
//     secretAccessKey: "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",
//     region: "ap-south-1"
// })

// let uploadFile = async (file)=>{
//     return new Promise(function(resolve, reject){
//         let s3 = new aws.S3({apiVersion : '2006-03-01'})

//         var uploadParams = {
//             ACL: "public-read",
//             Bucket: "classroom-training-bucket",  //HERE
//             Key: "abc/" + file.originalname, //HERE 
//             Body: file.buffer
//         }

//         s3.upload(uploadParams, function(err, data){
//             if(err){
//                 return reject({"error" : err})
//             }
//             console.log(data)
//             console.log("file uploaded succesfully")
//             return resolve(data.Location)
//         })
//     })
// }

// router.post('/createUrl', async function(req, res){
//     try{
//         let files = req.files
//         if(files && files.length>0){
//             let uploadFileUrl = await uploadFile(files[0])
//             return res.send({msg:"uploaded", data : uploadFileUrl})
//         }
//         else{
//             return res.status(400).send({ msg: "No file found" })
//         }
//     }
//     catch(error){
//         return res.status(500).send({ status: false, message: error.message }) 
//     }
// })

// 


//==============================================================================
router.use('*',(req, res) =>{
    res.status(400).send("Invalid url request");
})

module.exports = router