const bookModel = require('../model/bookModel');
const reviewModel = require('../model/reviewModel')



//<<========================================== Exported Validation Function ===============================>>//
const { isValidBody, isValid, isValidISBN, isValidDate, isValidObjectId, isValidAdd } = require('../validator/validation')



//<<====================================  Create Book Data =============================================//

const createBook = async (req, res) => {
    try {
        let data = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (isValidBody(data)) return res.status(400).send({ status: false, message: "Please Provide Data to Create Book" })

        if (!title) return res.status(400).send({ status: false, message: "Title is manadatory" })
        let uniqueTitle = await bookModel.findOne({ title: title })
        if (uniqueTitle) {
            return res.status(400).send({ status: false, message: "Book Title is already Existed" })
        }
        if (!isValid(title) || !isValidAdd(title)) return res.status(400).send({ status: false, message: "Please Enter Valid Title" })


        if (!excerpt) return res.status(400).send({ status: false, message: "Excerpt is manadatory" })
        if (!isValid(excerpt) || !isValidAdd(excerpt)) return res.status(400).send({ status: false, message: "Please Enter Valid excerpt" })
        if (excerpt.length < 5) {
            return res.status(400).send({ status: false, message: "Excerpt length should be more than 5 characters" })
        }

        if (!userId) return res.status(400).send({ status: false, message: "UserId is manadatory" })

        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is manadatory" })
        if (!isValidISBN(ISBN)) return res.status(400).send({ status: false, message: "Please Enter Valid ISBN" })
        let uniqueISBN = await bookModel.findOne({ ISBN: ISBN })
        if (uniqueISBN) {
            return res.status(400).send({ status: false, message: "ISBN already exists" })
        }

        if (!category) return res.status(400).send({ status: false, message: "Category is manadatory" })
        if (!isValid(category) || !isValidAdd(category) ) return res.status(400).send({ status: false, message: "Please Enter Valid Category" })

        if (!subcategory) return res.status(400).send({ status: false, message: "Subcategory is manadatory" })
        if (!isValid(subcategory) || !isValidAdd(subcategory)) return res.status(400).send({ status: false, message: "Please Enter Valid Subcategory" })

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
        if (data.hasOwnProperty("subcategory") && !subcategory) { return res.status(400).send({ status: false, message: "Please provide subcategory" }) }
            
        data.isDeleted = false

        let filter = { isDeleted: false }
        if (userId) filter.userId = userId
        if (category) filter.category = category
        if (subcategory) filter.subcategory = subcategory

        const getData = await bookModel.find(filter).select({ title: 1, excerpt: 1, userId: 1, category: 1, review: 1, releasedAt: 1 }).sort({ title: 1 });
        if (Object.keys(getData).length == 0) {
            return res.status(404).send({ status: true, message: "Book List", data: "No Such Book Present in Our Book Collection" })
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

        if (bookId) {
            if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Please Enter Valid bookId" }) }
        }
        let getBook = await bookModel.findById({ _id: bookId }).select({ __v: 0 })
        if (!getBook)
            return res.status(404).send({ status: false, message: "No Such Book Present in Our Collection" })

        if (getBook.isDeleted == true)
            return res.status(404).send({ status: false, message: "Such Book is already deleted." })

        let getReviews = await reviewModel.find({ bookId: getBook._id, isDeleted: false })
        getBook._doc.reviewData = getReviews
        return res.status(200).send({ status: true, count: getReviews.length, message: "Book List", data: getBook })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//<<==================================== Update Book by Params  =============================================//
const updateBook = async function (req, res) {
    try {
        let getBookId = req.params.bookId

        let checkBookId = await bookModel.findById(getBookId)
        if (!checkBookId) return res.status(400).send({ status: false, message: "Book not found" })
        if (checkBookId.isDeleted)
            return res.status(404).send({ status: false, message: "Book not found and may be deleted" })
        //body validation
        let data = req.body
        if (isValidBody(data))
            return res.status(400).send({ status: false, message: "Data is requierd in body to update" })

        if (data.hasOwnProperty('userId') || data.hasOwnProperty('review') || data.hasOwnProperty('isDeleted') || data.hasOwnProperty('deletedAt'))
            return res.status(400).send({ status: false, message: "Action Forfidden" })

        if (data.hasOwnProperty('title')) {
            let checkUniqueValue = await bookModel.findOne({ title: data.title })
            if (checkUniqueValue) return res.status(400).send({ status: false, message: "Title already exists" })
        }
        if (data.hasOwnProperty('ISBN')) {
            if (isValidISBN(data.ISBN)) {
                return res.status(400).send({ status: false, message: "enter valid ISBN number" })
            }
            let checkUniqueValue = await bookModel.findOne({ ISBN: data.ISBN })
            if (checkUniqueValue) return res.status(400).send({ statusbar: false, message: "ISBN already exists" })
        }
        if (isValidDate(data.releasedAt)) {
            return res.status(400).send({ status: false, message: "Enter valid releaseAt date" })
        }
        let updatebookData = await bookModel.findByIdAndUpdate(
            { _id: getBookId }, data, { new: true })
        return res.status(200).send({ status: true, message: "Book Updated Successfully", data: updatebookData })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

//<<==================================== Delete Book by Params  =============================================//

const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        // check bookId valid or not

        if (!isValidObjectId(bookId))
            return res.status(400).send({ status: false, message: "Invalid bookId" });

        // If is book present with given bookId
        let savedData = await bookModel.findById(bookId)
        if (!savedData) {
            return res.status(404).send({status: true, message: "No such bookId is present" });
        }
        //If book  is already deleted

        if (savedData.isDeleted)
            return res.status(404).send({ status: false, message: "Book not found... You have already deleted", });

        let updated = await bookModel.findByIdAndUpdate(savedData, { $set: { isDeleted: true, deletedAt: new Date() } });
        res.status(200).send({status: true, message : "Book is  deleted sucessfully"});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


// <<====================================== Imported Modules =========================>>//

module.exports = { createBook, getBook, getBookById, updateBook, deleteBook }