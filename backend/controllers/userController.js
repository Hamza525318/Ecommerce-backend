const ErrorHandler = require("../utils/errorHandler");
const asyncErrorHandler = require("../middleware/asyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const asyncError = require("../middleware/asyncError");
const sendMail = require("../utils/sendEmail");
const crypto = require("crypto");
const Product = require("../models/userModel");


//creating a new user accounts
exports.registerUser = asyncErrorHandler(async (req,res,next)=>{

    const{name,email,password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            publicId:"sample id",
            url:"sample url",
        }
    })

    sendToken(user,201,res);
})

//login user controller
exports.loginUser = asyncErrorHandler(async (req,res,next)=>{

    const{email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password",401));
    }


    const user = await User.findOne({email}).select("+password");

    if(!user){

        return next(new ErrorHandler("Invalid user or email",401));
    }

    const isPasswordMatched = await user.checkPassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

     sendToken(user,200,res);
})


//logout user controller
exports.logoutUser = asyncError(async (req,res,next)=>{

     res.cookie("token",null,{
        expires : new Date(Date.now()),
        httpOnly: true,
     });
     
     res.status(200).json({
        success:true,
        message:"Logged Out successfully",
     })

})


//forgot password controller
exports.forgotPassword = asyncError(async (req,res,next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("Count not find the Account registered with this email Id",404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your can reset your password on this link \n\n ${resetPasswordUrl} \n\n . If you have not opted for this option please ignore this message`;

    try {

        await sendMail({
            email: user.email,
            subject: "Password Recovery Email from Decouper",
            message: message,
        })

        res.status(200).json({
            success: true,
            message : `password reset mail sent to ${user.email} successfully`
        })
        
    } catch (error) {
        
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message,500));
    }
})

//reset password controller

exports.resetPassword = asyncError(async (req,res,next)=>{
       
    console.log(req.params.token)
    const resetToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    
    const user = await User.findOne({
        resetPasswordToken:resetToken,
        resetPasswordExpire:{$gt: Date.now()}
    });
    
    if(!user){
        return next(new ErrorHandler("User does not exists",400));
    }

    if(!req.body.password && !req.body.confirmPassword){
        return next(new ErrorHandler("Please enter password and confirm password",401));
    }

    if(!req.body.password){
        return next(new ErrorHandler("Please enter new password",401));
    }

    if(!req.body.confirmPassword){
        return next(new ErrorHandler("Please confirm password",401));
    }

    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    sendToken(user,200,res);


})

//Get user details after logged in
exports.getUserDetails = asyncError(async (req,res,next)=>{

    const user = await User.findById(req.user.id);
    console.log(req.user);

    res.status(200).json({
        success:true,
        user,
    })
})

//update user password
exports.updateUserPassword = asyncError(async (req,res,next)=>{
    
    
    const user = await User.findById(req.user.id).select("+password");
    

    const isPasswordMatched = user.checkPassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("The passoword you have entered is wrong",400))
    }
    
      
     if(req.body.password != req.body.confirmPassword){
        return next(new Error("password and confirm password does not matches",400));
     }
     

     user.password = req.body.password;

     await user.save();

      sendToken(user,200,res);

})

//controller to update user details
exports.updateProfileDetails = asyncError(async(req,res,next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }
    
    //Avatar pic later to be updated
   const user =  await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators: true,
        useFindAndModify: true,
    })

    res.status(200).json({
        success:true,
        user,
    })
})

//admin route
//controller to get all the users for admin

exports.getAllUsers = asyncError(async (req,res,next)=>{

    const users = await User.find();
    res.status(200).json({
        success:true,
        users,
    })

})

//admin route for admin to check user details
exports.getSingleUser = asyncError(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with the given id:${req.params.id}`,400));
    }

    res.status(200).json({
        success:true,
        user 
    })
})

//admin route
//update role for a user by admin
exports.updateUserRole = asyncError(async (req,res,next)=>{
    
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify: false,
    })

    if(!user){
        return next(new ErrorHandler(`Could not find the user with id:${req.params.id}`,400));
    }

    res.status(200).json({
        success:true,
        message:"Updated successfully",
    })
})

//admin route
//controller to delete user by admin
exports.deleteUserProfile = asyncError(async (req,res,next)=>{

    const user = await User.findByIdAndDelete(req.params.id);

    if(!user){
        return next(new ErrorHandler(`Could not find the user with id:${req.params.id}`,400));
    }

    

    res.status(200).json({
        success:true,
        message:"User deleted successfully"

    })
})

