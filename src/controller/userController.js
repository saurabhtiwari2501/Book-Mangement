const userModel = require('../model/userModel')
const jwt = require('jsonwebtoken')



const {isValidBody, isValid, isValidEmail, isValidpassword,  isValidPhone, isValidAdd} = require('../validator/validation')


//<<======================================  Registered User =================================================>>//

const createUser = async (req, res) => {
    try {

        let data = req.body;
        let {title, name, phone, email, password, address  } = data

        if(isValidBody(data)) return res.status(400).send({status: false, message : "Please Provide Data to User Registration"})

        if(!title) return res.status(400).send({status: false, message : "Title is manadatory"})
        if (!["Mr", "Mrs", "Miss"].includes(title)) {
            return res.status(400).send({ status: false, message : "Title must be type of ['Mr', 'Mrs', 'Miss']" })
        }

        if(!name) return res.status(400).send({status: false, message : "Name is manadatory"})
        if(!isValid(name)) return res.status(400).send({status: false, message : "Please Enter Valid Name"})

        if(!phone) return res.status(400).send({status: false, message : "Phone No. is manadatory"})
        if(!isValidPhone(phone)) return res.status(400).send({status: false, message : "Please Enter Valid Phone Number"})
        const existedPhone = await userModel.findOne({phone: phone });  
        if (existedPhone) {   
            return res.status(400).send({ status: false, message: "Phone number already registered" }); //checking is there any similar phone no. is present or not in DB
        }
        
        if(!email) return res.status(400).send({status: false, message : "Email-Id is manadatory"})
        if(!isValidEmail(email)) return res.status(400).send({status: false, message : "Please Enter Valid Email Id"})
        const existedEmail = await userModel.findOne({ email: email });    
        if (existedEmail) {
            return res.status(400).send({ status: false, message: "Email is already registered" }); //checking is there any similar Email is present or not in DB
        }

        if(!password) return res.status(400).send({status: false, message : "Password is manadatory"})
        if(!isValidpassword(password))  {
            return res.status(400).send({status: false, message : "Please Enter Valid Password It should be length(6-15) character [Ex - Abc@123]" })
        }

        if(!address) return res.status(400).send({status: false, message : "Address is manadatory"})
        if(!isValidAdd(address)) return res.status(400).send({ status: false, message: "Please Enter Valid Address" })

        let createUser = await userModel.create(data)
        res.status(201).send({status: true, message: "User Register Successfully" , data : createUser})


    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


//<<====================================== User Login  =================================================>>//

const userLogin = async (req, res) => {
    try {

        let { email, password } = req.body
        if(isValidBody(req.body)) return res.status(400).send({status: false, message : "Credential is required for login."})
        if (!email)
            return res.status(400).send({ status: false, message: "EmailId is mandatory" })
        if (!password)
            return res.status(400).send({ status: false, message: "Password is mandatory" })
        let user = await userModel.findOne({ email: email, password: password });
        if (!user)
            return res.status(401).send({ status: false, message: "Your Credencial is not valid." })
        let token = jwt.sign(
            {
                userId: user._id.toString(),
                Library: "Plutonium",
            },
            "Book-Management-Project", { expiresIn: '1d' });
            
    
        return res.status(201).send({ status: true, message: "User Login Successfully" , token : token })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}






module.exports = { createUser, userLogin };