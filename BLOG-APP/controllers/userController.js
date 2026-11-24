const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')


exports.registerController = async(req,res) => {

    try{

        const {username , email , password} = req.body

        if(!username || !email || !password) {
            return res.status(400).send({
                succes : false,
                message : " please fill all fields"
            })
        }

        const existingUser = await userModel.findOne({email})
        if(existingUser) {
            return res.status(401).send ({
                success : false,
                message : "user already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10)
        password = hashedPassword

        const user = new userModel({username , email , password : hashedPassword})
        await user.save()
        return res.status(201).send({
            success : true,
            message : "user registered successfully", user
        })

    }catch(error) {
        console.log(error)
        return res.status(500).json({
            message : "Error in register",
            success : false,
            error

        })
    }
}


exports.getAllUsers = async(req,res) => {

    try
    {

        const users = await userModel.find({})
        return res.status(200).json({
            userCount : users.length,
            success : true,
            message : "Users fetched successfully",
            users
        })
    }

    catch(error) {
        console.log(error)
        return res.status(500).json({
            message : "Error in fetching users",
            success : false,
            error
        })
    }
};




exports.loginController = async(req,res) => {
    try{
        const {email , password} = req.body

        if(!email || !password) {
            return res.status(400).send({
                success : false,
                message : " please fill all fields"
            })
        }

        const user = await userModel.findOne({email})
        if(!user) {
            return res.status(404).send({
                success : false,
                message : "user not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(401).send({
                success : false,
                message : "invalid credentials"
            })
        }

        return res.status(200).send({
            success : true,
            message : "login successful",
            user
        })

    }
    catch(error) {
        console.log(error)
        return res.status(500).send({
            message : "Error in login",
            success : false,
            error
        })
    }
}