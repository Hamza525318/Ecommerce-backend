const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncError = require("./asyncError");
const jwt = require("jsonwebtoken");

//check whether user is trying to access any resources without logging in , if he is not logged in then there wont be any cookie and you can prompt the user to login, if user is aldready logged in you can decode the token from the cookie and get the user details from the database

exports.isAuthenticatedUser = asyncError(async (req,res,next)=>{

    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please Login to acess the resources",401));
    }

    const decodedData = jwt.verify(token,process.env.JWT_PRIVATE_KEY);
    req.user = await userModel.findById(decodedData.id);

    next();
})

exports.authorizeRoles = (...roles)=>{

    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} not allowed to access the resource`,403));
        }

        next();
    }
}