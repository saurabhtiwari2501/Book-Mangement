const mongoose = require('mongoose')
const ObjectId = mongoose.Types.Schema.ObjectId
const moment = require('moment')

const bookSchema = new mongoose.Schema({

    title: {
        type : string,
        required : true,
        unique: true,
        trim : true
    },
    excerpt: {
        type: string, 
        required : true,
        trim : true
    },
    userId : {
        type : ObjectId,
        ref : "user",  // ref to userModel 
        required : true
    },ISBN: {
        type: string, 
        unique: true,
        required: true,
        trim : true
    },
    category: {
        type: string, 
        required : true,
        trim : true
    },
    subcategory: {
        type: [string], 
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
        date :  Date.now()   //format("YYYY-MM-DD")}
    }  

    
}, {timestamp : true});



module.exports = mongoose.model("book" , bookSchema);


















