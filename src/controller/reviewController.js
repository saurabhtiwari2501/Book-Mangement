const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')


const { isValidObjectId, isValidBody, isValid, isValidReview, isValidRating ,isValidAdd} = require('../validator/validation');


//<<====================================  Create Book Review =============================================//
const createReview = async (req, res) => {
    try {

        let bookId = req.params.bookId
        let data = req.body
        let { reviewedBy, rating, review } = data;

        if (bookId) {
            if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please Enter Valid bookId in params" })
        }

        let checkBookId = await bookModel.findOne({ bookId: bookId })
        // console.log(checkBookId)
        if (checkBookId.isDeleted == true) return res.status(400).send({ status: false, message: "No Such Book Present in Our Book Collection" })

        if (isValidBody(data)) return res.status(400).send({ status: false, message: "Please Provide Review Data" })
        if (!isValidRating(rating)) {
            return res.status(400).send({ status: true, message: "Please Enter Book Rating between 1-5 (not decimal)." })
        }
        if (reviewedBy) {
            if (!(reviewedBy)) return res.status(400).send({ status: true, message: "Please provide Book Reviewer name" })
            if (!isValid(reviewedBy)) return res.status(400).send({ status: true, message: "Reviewer's Name Should be Alphabets Only" })
        }

        if (!review) return res.status(400).send({ status: false, message: "Please Enter Valid review" })
        if (!isValidReview(review)) return res.status(400).send({ status: true, message: "Review Should be Alphabets Only" })

        data.reviewedAt = Date.now()
        data.bookId = bookId

        let bookReview = await reviewModel.create(data)

        let filter = { isDeleted: false }
        filter.bookId = bookReview.bookId
        let allReview = await reviewModel.find(filter).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 }).sort({ reviewedBy: 1 });

        console.log(allReview.length)
        let finalBook = await bookModel.findOneAndUpdate({ _id: bookId }, { reviews: allReview.length }, { new: true }).select({ __v: 0 })

        finalBook._doc.reviewsData = allReview
        return res.status(201).send({ status: true, message: "Successful", data: finalBook })
    }

    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

//<<====================================  Update Book Review  =============================================//

const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!bookId) return res.status(400).send({ status: false, message: "BookId must be given in Params." });
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please Enter Valid BookId for update review" })
        let checkBookId = await bookModel.findById(bookId)
        if (!checkBookId) return res.status(404).send({ status: false, message: "No Such Book present in Our Book Collection" })
        if (checkBookId.isDeleted == true) return res.status(404).send({ status: false, message: "Such BookId already deleted" })

        let reviewId = req.params.reviewId

        if (!reviewId) return res.status(400).send({ status: false, message: "ReviewId must be given in Params." });
        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Please Enter Valid ReviewId for update review" })
        let checkReviewId = await reviewModel.findById(reviewId)
        if (!checkReviewId) return res.status(404).send({ status: false, message: "No Such Book Review present" })
        if (checkReviewId.isDeleted == true) return res.status(404).send({ status: false, message: "Such Review already deleted" })

        if(bookId !== checkReviewId.bookId.toString()) return res.status(404).send({ status: false, message: "Such Review not present in this given BookId" })

        let data = req.body
        let {  reviewedBy, rating, review  } = data;

        if (isValidBody(data)) return res.status(400).send({ status: false, message: "Data requierd in body to update review" })

        if (reviewedBy) {
            if (!reviewedBy) return res.status(400).send({ status: false, message: "Reviewer's Name Should be present" })
            if(!isValid(reviewedBy)) return res.status(400).send({ status: true, message: "Reviewer's Name Should be Alphabets Only" })
            if (!isValidAdd(reviewedBy)) return res.status(400).send({ status: true, message: "Reviewer's Name Should be Valid" })
            let checkreviewedBy = await reviewModel.findOne({ reviewedBy: reviewedBy })
            if (checkreviewedBy) return res.status(400).send({ status: false, message: "Reviewer's Name already exists" })
        }

        if (rating) {
            if(!rating) return res.status(400).send({ status: false, message: "Rating Should be present" })
            if(!isValidRating(rating)) return res.status(400).send({ status: false, message: "Please Enter Book Rating between 1-5 (not decimal)." })
            let checkUniqueValue = await reviewModel.findOne({ rating: rating })
            if (checkUniqueValue) return res.status(400).send({ status: false, message: "Rating already exists" })
        }

        if (review) {
            if (!review) return res.status(400).send({ status: false, message: "Review Should be present" })
            if (!isValidReview(review)) return res.status(400).send({ status: true, message: "Review Should be Alphabets Only" })
            let checkreview = await reviewModel.findOne({ review: review})
            if (checkreview) return res.status(400).send({ status: false, message: "Reviewe already exists" })
        }

       

        let updateReviewData = await reviewModel.findByIdAndUpdate({ _id: reviewId }, data, { new: true })
        return res.send({ status: true, message: "Review Successfully updated", data: updateReviewData })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

//<<====================================  Delete Book Review  =============================================//

const deleteReview = async function (req, res) {
    try {
        let getId = req.params

        if (!isValidObjectId(getId.bookId))
            return res.status(400).send({ status: false, msg: "Enter Valid Book Id" })

        if (!isValidObjectId(getId.reviewId))
            return res.status(400).send({ status: false, msg: "Enter Valid review Id" })


        let checkReviewId = await reviewModel.findById(getId.reviewId)
        if (!checkReviewId) return res.status(404).send({ status: false, msg: "Review not found, Check your Id " })

        if (checkReviewId.bookId.toString() !== getId.bookId)
            return res.status(404).send({ status: false, msg: "Book not found, check Id" })

        if (checkReviewId.isDeleted == true)
            return res.status(404).send({ status: false, msg: "Review not found and alredy deleted" })

        await reviewModel.updateOne({ _id: getId.reviewId }, { isDeleted: true })



        return res.status(200).send({ status: true, msg: "Deleted Succesfully" })
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }

}




module.exports = { createReview, deleteReview, updateReview };