const userModel = require('../model/userModel')



const register = async (req, res) => {
    try {

        let data = req.body;
        let {title, name, phone, email, password, address  } = data

        if(Object.keys(data) == 0) return res.status(400).send({status: false, message : "Please Provide Data to User Registration"})
        if(!title) return res.status(400).send({status: false, message : "Title is manadatory"})
        if(!name) return res.status(400).send({status: false, message : "User Name is manadatory"})
        if(!phone) return res.status(400).send({status: false, message : "Phone No. is manadatory"})
        if(!email) return res.status(400).send({status: false, message : "Email-Id is manadatory"})
        if(!password) return res.status(400).send({status: false, message : "Password is manadatory"})
        if(!address) return res.status(400).send({status: false, message : "Address is manadatory"})

        let createUser = await userModel.create(data)

        res.status(201).send({status: true, message: "User Register Successfully" , data : createUser})



    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }

}






module.exports = { register };