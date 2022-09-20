//<<----------------Validation for Body ---------------->>
const isValidBody = function (body) {
    return Object.keys(body).length == 0
}


// //<<----------------Validation for Name ---------------->>
// const isValidName = function (name){
//     return (/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/).test(name) 
// }



//<<----------------Validation for College Name ---------------->>
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false 
     return true
  }


//<<----------------Validation for Email ---------------->>  
const isValidEmail = function (email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

//<<----------------Validation for password ---------------->>  
const isValidpassword = function (email) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/.test(email);
}



//<<----------------Validation for Mobile No. ---------------->>
const isValidPhone = function (phone) {
    return !/^[6-9]\d{9}$/.test(phone);
}










//<<============================Imported Validation Function Modules ===========================>>//

module.exports = {isValidBody, isValid, isValidEmail,  isValidPhone, isValidpassword }






