const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");
const bookController = require('../controller/bookController');
const midAuth = require('../middleware/auth')





//<<<< ========== Book-Management (Project-3) ====================>>>

//--- User Register Api----
router.post('/register', userController.createUser)

//--- User Login Api----
router.post('/login', userController.userLogin)

//--- Create Book Api----
router.post('/books', midAuth.authenticate, bookController.createBook)

//---- Get Book list by bookId in params Api ---
router.get('/books', midAuth.authenticate, bookController.getBook)

//--- Get Book with Review by query-params Api---
router.get('/books/:bookId', midAuth.authenticate, bookController.getBookById)






//API for wrong route-of-API
router.all("/*", function (req, res) {
    res.status(400).send({
        status: false,
        message: "Path Not Found"
    })
})




//<----------------Export router Module --------------------------//

module.exports = router;


