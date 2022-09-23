const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')


const { isValidObjectId, isValidBody, isValid, isValidReview, isValidRating } = require('../validator/validation');


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
        let BookId = req.params.bookId
        let reviewId = req.params.reviewId
        let checkBookId = await bookModel.findById(BookId)
                if (!checkBookId) return res.status(400).send({ status: false, message: "Book id is not present" })
        let existedReviewId = await reviewModel.findById(reviewId)
        if (!existedReviewId) return res.status(400).send({ status: false, message: "No Such ReviewId Present" })
        
        if (checkBookId.isDeleted == true)
            return res.status(404).send({ status: false, message: "not updated" })
        //body validation
        let data = req.body
        if (isValidBody(data))
            return res.status(400).send({ status: false, message: "Data is requierd in body to update" })


       
        if (data.hasOwnProperty('review')) {
            let checkUniqueValue = await reviewModel.findOne({ review: data.review })
            if (checkUniqueValue) return res.status(400).send({ status: false, message: "Book Review already updated" })
        }

        if (data.hasOwnProperty('rating')) {
            if(!isValidRating(data.rating)) return res.status(400).send({ status: false, message: "Please Enter Book Rating between 1-5 (not decimal)." })
            let checkUniqueValue = await reviewModel.findOne({ rating: data.rating })
            if (checkUniqueValue) return res.status(400).send({ status: false, message:"Book Rating already updated"})
        }
        
        let updateReviewData = await reviewModel.findByIdAndUpdate({ _id: reviewId }, data, { new: true })
        return res.send({ status: true, message: "Success", data: updateReviewData })


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




module.exports = { createReview,  deleteReview , updateReview};