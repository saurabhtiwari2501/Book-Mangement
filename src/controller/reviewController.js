const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')


const { isValidObjectId, isValidBody, isValid, isValidReview } = require('../validator/validation');

const createReview = async (req, res) => {
    try {

        let bookId = req.params.bookId
        let data = req.body
        let { reviewedBy, rating, review } = data;

        if (bookId) {
            if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please Enter Valid bookId in params" })
        }

        let checkBookId = await bookModel.findOne({ bookId: bookId, isDeleted: false })
        if (!checkBookId) return res.status(400).send({ status: false, message: "No Such Book Present in Our Book Collection" })

        if (isValidBody(data)) return res.status(400).send({ status: false, message: "Please Provide Review Data" })
        if (rating) {
            if (!(rating >= 1 && rating <= 5))
                return res.status(400).send({ status: true, message: "Please Enter Book rating between 1-5" })
        }

        if (!reviewedBy) return res.status(400).send({ status: true, message: "Please provide Book reviewer name " })
        if (!isValid(reviewedBy)) return res.status(400).send({ status: true, message: "Name Should be Alphabets Only" })

        if (!review) return res.status(400).send({ status: false, message: "Please Enter Valid review" })
        if (!isValidReview(review)) return res.status(400).send({ status: true, message: "Review Should be Alphabets Only" })

        if (!isValidBody)
            if (!(data.bookId)) return res.status(400).send({ status: false, message: "BookId is mandatory" });
        if (!isValidObjectId(data.bookId)) return res.status(400).send({ status: false, message: "Please Enter Correct BookId" });

        data.reviewedAt = Date.now()
        data.bookId = bookId

        let bookReview = await reviewModel.create(data)
        let id = bookReview.bookId.toString()
        let allReview = await reviewModel.find({id}).select({_id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1,  rating: 1, review: 1}).sort({ reviewedBy: 1 });
        let finalBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 }}, { new: true }).select({ __v: 0 })

        finalBook._doc.reviewsData = allReview

        return res.status(201).send({ status: true, message: "Successful", data: finalBook })
    }

    catch (err) {
    return res.status(500).send({ status: false, message: err.message })
}

}







module.exports = { createReview };