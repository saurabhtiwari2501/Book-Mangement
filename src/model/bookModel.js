const mongoose = require('mongoose')
const ObjectId = mongoose.Types.Schema.ObjectId
const moment = require('moment')

const bookSchema = new mongoose.Schema({

    title: {
        type : String,
        required : true,
        unique: true,
        trim : true
    },
    excerpt: {
        type: String, 
        required : true,
        trim : true
    },
    userId : {
        type : ObjectId,
        ref : "user",  // ref to userModel 
        required : true,
        trim : true
    },
    ISBN: {
        type: String, 
        unique: true,
        required: true,
        trim : true
    },
    category: {
        type: String, 
        required : true,
        trim : true
    },
    subcategory: {
        type: [String], 
        required: true,
        trim: true
    },
    reviews: {
        type: Number, 
        default: 0, 
        comment: Number,  // Holds number of reviews of this book

    },
    deletedAt: {
        type : Date,          //  when the document is deleted
        default : null  
    },
    isDeleted: {
        type: boolean, 
        default: false
    },
    releasedAt: {
        type : Date, 
        required: true,
        date :  Date.now,   //format("YYYY-MM-DD")}
        trim : true
    }  

    
}, {timestamps: true});



module.exports = mongoose.model("book" , bookSchema);


















