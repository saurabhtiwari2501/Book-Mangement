const bookModel = require('../model/bookModel');
const userModel = require('../model/userModel')
const reviewModel = require('../model/reviewModel')



//<<========================================== Exported Validation Function ===============================>>//
const { isValidBody, isValid, isValidISBN, isValidDate, isValidObjectId } = require('../validator/validation')



//<<====================================  Create Book Data =============================================//

const createBook = async (req, res) => {
    try {
        let data = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (isValidBody(data)) return res.status(400).send({ status: false, message: "Please Provide Data to Create Book" })

        if (!title) return res.status(400).send({ status: false, message: "Title is manadatory" })
        let uniqueTitle = await bookModel.findOne({title : title})
        if(uniqueTitle){
            return res.status(400).send({ status: false, message: "Book Title is already Existed" })
        }
        if (!isValid(title)) return res.status(400).send({ status: false, message: "Please Enter Valid Title" })

        if (!excerpt) return res.status(400).send({ status: false, message: "Excerpt is manadatory" })
        if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "Please Enter Valid excerpt" })
        if (excerpt.length < 5) {
            return res.status(400).send({ status: false, message: "Excerpt length should be more than 5 characters" })
        }

        if (!userId) return res.status(400).send({ status: false, message: "UserId is manadatory" })
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please Enter Valid User Id" })
        }

        if (userId !== req.token.userId) {
            return res.status(403).send({ status: false, msg: "You are not Authorised to Create Book Data." })
        }

        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is manadatory" })
        if (!isValidISBN(ISBN)) return res.status(400).send({ status: false, message: "Please Enter Valid ISBN" })
        let uniqueISBN = await bookModel.findOne({ ISBN: ISBN })
        if (uniqueISBN) {
            return res.status(400).send({ status: false, message: "ISBN already exists" })
        }

        if (!category) return res.status(400).send({ status: false, message: "Category is manadatory" })
        if (!isValid(category)) return res.status(400).send({ status: false, message: "Please Enter Valid Category" })

        if (!subcategory) return res.status(400).send({ status: false, message: "Subcategory is manadatory" })
        if (!isValid(subcategory)) return res.status(400).send({ status: false, message: "Please Enter Valid Subcategory" })

        if (!releasedAt) return res.status(400).send({ status: false, message: "ReleaseAt is manadatory" })
        if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "Please Enter Date in Valid format Ex- [YYYY-MM-DD]" })

        let saveBookData = await bookModel.create(data)
        res.status(201).send({ status: true, message: "Book Created Successfully", data: saveBookData })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


//<<==================================== Get Book List By Query Params data  =============================================//


const getBook = async (req, res) => {
    try {
        let data = req.query
        let { userId, category, subcategory } = data
        
        if (data.hasOwnProperty("userId") && !userId) { return res.status(400).send({ status: false, message: "Please provide userId" }) }
        if (data.hasOwnProperty("category") && !category) { return res.status(400).send({ status: false, message: "Please provide category" }) }
        if (data.hasOwnProperty("subcategory") && !subcategory) { return res.status(400).send({ status: false, message: "Please provide excerpt" }) }
        if (userId) {
            if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "Please Enter Valid UserId" }) }
        }
        let filter = { isDeleted: false }
        if (userId) filter.userId = userId
        if (category) filter.category = category
        if (subcategory) filter.subcategory = subcategory

        const getData = await bookModel.find(filter).select({title: 1, excerpt: 1, userId: 1, category: 1,  review: 1, releasedAt: 1})
        if (Object.keys(getData).length == 0) {
            return res.status(404).send({ status: true, message: "Book List", data: "No Such Book Present in Book Collection" })
        } else {
            return res.status(200).send({ status: true, message: "Book List", data: getData })
        }

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })

    }
}



//<<==================================== Get Books with Review By Book Id in params  =============================================//


const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        console.log(bookId)

        let getBook = await bookModel.findById({ _id: bookId }).select({ __v: 0 })
        if (!getBook)
            return res.status(404).send({ status: false, message: "No book found" })

        if (getBook.isDeleted == true)
            return res.status(404).send({ status: false, message: "Book not found and already deleted" })

        let getReviews = await reviewModel.find({ bookId: getBook._id, isDeleted: false })
        getBook._doc.reviewData = getReviews
        return res.status(200).send({ status: true, count: getReviews.length, message: "Book List", data: getBook })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



// <<====================================== Imported Modules =========================>>//

module.exports = { createBook, getBook,  getBookById }