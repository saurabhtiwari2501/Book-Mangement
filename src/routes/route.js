const express = require('express');
const router= express.Router();
const userController = require ("../controller/userController");






//<<<< ========== Book-Management (Project-3) ====================>>>

//--- User Register Api--
router.post('/register' , userController.register)







//API for wrong route-of-API
router.all("/*", function (req, res) {
    res.status(400).send({
        status: false,
        message: "Path Not Found"
    })
})




//<----------------Export router Module --------------------------//

module.exports= router;


