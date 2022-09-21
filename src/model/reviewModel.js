const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const reviewSchema = new mongoose.Schema({

    bookId: {
        type: ObjectId,
        ref: "book",  // ref to bookModel 
        required: true
    },
    reviewedBy: {
        type: String,
        required: true,
        trim: true,
        default: 'Guest',
        value: String,  //reviewer's name
    },
    reviewedAt: { 
        type: Date,
        required: true,
        date: Date.now
     },
     rating: {
        type: Number, 
        required: true,
        min: 1,
        max: 5,
        trim : true
    },
    review: {
        type: String,
        trim : true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
  


}, { timestamps: true });



module.exports = mongoose.model("review", reviewSchema);




