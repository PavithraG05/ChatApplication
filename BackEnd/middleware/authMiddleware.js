const jwt = require("jsonwebtoken");
const asyncErrorHandler=require("../utils/asyncErrorHandler")
const User = require("../models/userModel")
const CustomError = require("../utils/CustomError")

const protect = asyncErrorHandler(async(req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");
        next();
    }
    else{
        let errorMessage = `"Authorization Error: token Failed"`;
        const err = new CustomError(401, errorMessage);
        return next(err);
    }
})

module.exports = protect