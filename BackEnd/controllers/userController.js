const userModel = require('../models/userModel')
const generateToken = require("../config/generateToken")
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const CustomError = require('../utils/CustomError')

const registerUser = asyncErrorHandler(async(req, res, next) => {
   
    const {name, email, password, profile} =  req.body;
    let errorMessage = '';

    if(!name || !email || !password){
        errorMessage = `Missing one or more required fields`
        const err = new CustomError(400, errorMessage);
        return next(err);
    }
    
    const userExists = await userModel.findOne({email});
    if(userExists){
        errorMessage = `error: "User already exists"`;
        const err = new CustomError(400, errorMessage);
        return next(err);
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
        errorMessage = `error:"Failed to create user"`;
        const err = new CustomError(400, errorMessage);
        return next(err);
    }

})

const authUser = asyncErrorHandler( async(req, res, next)=>{
    
    const {email, password} = req.body;
    console.log(email);
    let errorMessage = '';

    const user = await userModel.findOne({email});
    console.log(user);
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
        errorMessage = `error:"Authentication Failed"`;
        const err = new CustomError(401, errorMessage);
        return next(err);
    }
})

const searchUser = asyncErrorHandler( async(req, res, next)=>{

    const enteredSearchText = req.query.search;
    const searchKey = enteredSearchText ? {
        $or: [
            {name: {$regex : enteredSearchText, $options:"i"}},
            {email: {$regex : enteredSearchText, $options:"i"}},
        ],
    }: {};

    const users = await userModel.find(searchKey).find({_id:{$ne: req.user._id}});
    res.status(200).json({users})

})

module.exports = {registerUser, authUser, searchUser};