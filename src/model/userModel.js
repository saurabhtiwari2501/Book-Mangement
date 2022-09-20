const mongoose = require('mongoose')

const userSchema = new mngoose.Schema({

    title: {
        type : string,
        required : true,
        enum : ["Mr", "Mrs", "Miss"],
        trim : true
    },
    name: {
        type: string, 
        required : true,
        trim : true
    },
    phone: {
        type: string, 
        required: true,
        unique : true,
        trim: true
    },
    email: {
        type: string,
        required : true,
        unique: true,
        trim: true,
        toLowerCase : true
    },
    password: {
        type: string,
        required : true,
        trim: true
    },
    address: {
              street: {type: string, trim: true},
              city: {type: string, trim: true},
              pincode: {type: string, trim: true}
            },

}, {timestamp : true})



module.exports = mongoose.model("user" , userSchema);




















