const userModel = require('../models/userModel')
const generateToken = require("../config/generateToken")


const registerUser = async(req,res) => {
    try{
        const {name, email, password, profile} =  req.body;

        if(!name || !email || !password){
            res.status(400).json(`error: "Missing data, can't process: one or more book properties missing."`)
            // throw new Error("Missing data fields")
            return
        }
        
        const userExists = await userModel.findOne({email});
        if(userExists){
            res.status(400).json(`error: "User already exists"`)
            // throw new Error("user already exists")
            return
        }

        const user = await userModel.create({
            name,
            email,
            password,
            profile,
        });

        if(user){
            res.status(201).json({
                _id : user._id,
                name: user.name,
                email:user.email, 
                profile:user.profile,
                token: generateToken(user._id),
            });
        }
        else{
            res.status.status(400).json(`error:"Failed to create user"`);
        }

    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message })
    }
}

const authUser=async(req,res)=>{
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
    if(user&& (await user.matchPassword(password))){
        res.status(200).json({
                _id : user._id,
                name: user.name,
                email:user.email,
                profile:user.profile,
                token: generateToken(user._id),
            })
    }
    else{
        res.status(401).json(`error:"Authentication Failed"`);
    }
}

module.exports = {registerUser, authUser};