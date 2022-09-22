const mongoose = require('mongoose')

//<<----------------Validation for Body ---------------->>
const isValidBody = function (body) {
    return Object.keys(body).length == 0
}


//<<----------------Validation for ISBN ---------------->>
const isValidISBN = function (isbn){
    return (/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/).test(isbn) 
}



//<<----------------Validation for string ---------------->>
const isValid = function (value) {
    return  (/^[a-zA-Z .]+$/).test(value)
  }

  //<<----------------Validation for review ---------------->>
const isValidReview = function (review) {
    return (/^[a-zA-Z_.-\s]+$/).test(review)
    
  };

//<<----------------Validation for Email ---------------->>  
const isValidEmail = function (email) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email);
}

//<<----------------Validation for password ---------------->>  
const isValidpassword = function (pass) {
    return (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/).test(pass);
}



//<<----------------Validation for Mobile No. ---------------->>
const isValidPhone = function (phone) {
    return (/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/).test(phone);
}



//<<----------------Validation for Releate At date. ---------------->>
const isValidDate = function (date) {
    return (/^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/).test(date)
}

//valiadating object id 
const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
};

const isValidAdd = function (value) {
    if (typeof value == undefined || value == null) return false
    if (typeof value == "string" && value.trim().length == 0) return false
    return true
  }

// const verifyId = function (Id) {
//     if (!mongoose.Types.ObjectId.isValid(Id)) {
//       return false
//     }
//     return (true)
//   }


// ^[0-9]{6}   -- for pincode



//<<============================Imported Validation Function Modules ===========================>>//

module.exports = {
                isValidBody, 
                isValid,
                isValidEmail,
                isValidPhone, 
                isValidpassword, 
                isValidISBN , 
                isValidDate ,
                isValidObjectId, 
                isValidAdd,
                isValidReview
            }






