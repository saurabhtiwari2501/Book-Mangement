const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");
const bookController = require('../controller/bookController');
const reviewController = require('../controller/reviewController')
const midAuth = require('../middleware/auth')





//<<<< ========== Book-Management (Project-3) ====================>>>

//--- User Register Api----
router.post('/register', userController.createUser)

//--- User Login Api----
router.post('/login', userController.userLogin)

//--- Create Book Api----
router.post('/books', midAuth.authenticate, midAuth.authorise, bookController.createBook)

//---- Get Book list by bookId in params Api ---
router.get('/books',  midAuth.authenticate, bookController.getBook)

//--- Get Book with Review by query-params Api---
router.get('/books/:bookId',  midAuth.authenticate, bookController.getBookById)

//-- Update Book by Params Api ---
router.put('/books/:bookId', midAuth.authenticate, midAuth.authorise,bookController.updateBook)

//-- Delete Book by Params Api ---
router.delete('/books/:bookId', midAuth.authenticate, midAuth.authorise, bookController.deleteBook)

//--- Create Review Api---
router.post('/books/:bookId/review', reviewController.createReview)

//--- Update Review Api---
router.put('/books/:bookId/review/:reviewId', reviewController.updateReview)

//--- Delete Review Api---
router.delete('/books/:bookId/review/:reviewId',  reviewController.deleteReview)






//API for wrong route-of-API
router.all("/*", function (req, res) {
    res.status(400).send({
        status: false,
        message: "Path Not Found"
    })
})




//<----------------Export router Module --------------------------//

module.exports = router;


