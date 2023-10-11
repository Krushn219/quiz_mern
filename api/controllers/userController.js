const User = require("../models/User")

module.exports.create = async(req,res)=>{
    const {user_name,email,password} = req.body

    if(!user_name || !email || !password){
        return res.status(400).json({
            success: true,
            msg:"All fields are required!!"
        })
    }

    const user = await User.create(req.body)

    if(!user){
        return res.status(400).json({
            success: true,
            msg:"Something went wrong!!"
        })
    }

    return res.status(202).json({
        success: true,
        msg:"User created Successfully",
        user
    })
}