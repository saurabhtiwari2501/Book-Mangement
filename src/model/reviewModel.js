const mongoose = require('mongoose')
const ObjectId = mongoose.Types.Schema.ObjectId
const moment = require('moment')

const reviewSchema = new mongoose.Schema({

    bookId: {
        type: ObjectId,
        ref: "book",  // ref to bookModel 
        required: true
    },
    reviewedBy: {
        type: string,
        required: true,
        trim: true,
        default: 'Guest',
        value: String,  //reviewer's name
    },
    reviewedAt: { 
        type: Date,
        required: true,
        date: Date.now()
     },
     rating: {
        type: Number, 
        required: true,
        trim : true
    },
    review: {
        type: String,
    },
    isDeleted: {
        type: boolean,
        default: false
    },
  


}, { timestamp: true });



module.exports = mongoose.model("review", reviewSchema);




