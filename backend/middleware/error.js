const ErrorHandler = require("../utils/errorHandler");

module.exports = (err,req,res,next)=>{
    
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    
    //Wrong mongodb id error
    if(err.name === "CastError"){
        const message = `Resource not found ${err.path}`;
        err = new ErrorHandler(message,400);
    }
    
    //Duplicate key error mongodb
    if(err.code === 11000){
        const message = `Account aldready exists with ${Object.keys(err.keyValue)}`
        err = new ErrorHandler(message,400);
    }

    //wrong JWT Error
    if(err.name === "JsonWebTokenError"){
        const message = "JSON WEB TOKEN IS INVALID PLEASE TRY AGAIN",
        err = new ErrorHandler(message,400);
    }

    //JWT TOKEN EXPIRED ERROR
     if(err.name === "TokenExpiredError"){
        const message = "JSON WEB TOKEN IS EXPIRED ,PLEASE TRY AGAIN",
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        status:err.statusCode,
        message:err.message,
    })

}

