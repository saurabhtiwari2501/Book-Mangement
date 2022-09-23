const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const bookModel = require('../model/bookModel');
const userModel = require('../model/userModel');



//============================================= Authentication =============================================//

const authenticate = async (req, res, next) => {
    try {
        let token = req.headers['x-api-key'];
        if (!token) return res.status(401).send({ status: false, message: "Token must be present" });
        jwt.verify(token, "Book-Management-Project", (err, decode) => {
            if (err) {
                return res.status(401).send({ status: false, message: "Error : Invalid Token or Expired Token" })
            }
            req.token = decode
            next();
        })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}


//============================================= Authorisation =============================================//

const authorise = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"]
        let decodeToken = jwt.verify(token, "Book-Management-Project")
        let userLoggedIn = decodeToken.userId

        let userId = req.body.userId
        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).send({ status: false, message: "UserId is Invalid, Please Enter Correct Id" })
            }

            let saveUser = await userModel.findById(userId)
            if (!saveUser) {
                return res.status(404).send({ status: false, message: "No Such User Available" })
            }

            if (userId !== userLoggedIn) {
                return res.status(403).send({ status: false, message: " You are not Authorised User..!!" })
            }
        }

        let bookId = req.params.bookId
        if (bookId) {
            if (!mongoose.Types.ObjectId.isValid(bookId)) {
                return res.status(400).send({ status: false, message: "BookId is Invalid, Please Enter Correct Id" })
            }

            let saveBook = await bookModel.findById(bookId)
            if (!saveBook) {
                return res.status(404).send({ status: false, message: "No Such Book Available" })
            }
            if(saveBook){
                if(saveBook.isDeleted == true)
                return res.status(400).send({ status: false, message: "Such BookId already deleted." })
            }

            if (saveBook.userId.toString() !== userLoggedIn) {
                return res.status(403).send({ status: false, message: " You are not Authorised User..!!" })
            }
        }

        next();

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}





//=================================== Exported Modules =====================================//
module.exports = { authenticate, authorise };