const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

    name:{
       type: String,
       require: [true,"Please enter username"],
       maxLength: [35,"Username cannot excede 35 characters"],
       minLength: [3,"Username should contain atleast 3 characters"]

    },

    email:{
        type: String,
        require:[true,"Please enter email"],
        unique: true,
        validate:[validator.isEmail,"please enter Valid Email"]
    },

    password:{
        type:String,
        require:[true,"Please enter Password"],
        select: false,
        minLength:[8,"Password should be greater than 8 characters"],
    },

    avatar:{
        publicId:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
   
    role:{
        type:String,
        default:"user",
    },

    resetPasswordToken : String,
    resetPasswordExpire: Date,


})
//the below snippet is a hook that runs beforing saving a new document in the database,it is used to hash the
//password so that noone can access it

userSchema.pre("save",async function(next){
     
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password,10);
})

//creating a JSON web token whenever there is a new entry

userSchema.methods.generateJWT = function(){

    return jwt.sign({id: this._id},process.env.JWT_PRIVATE_KEY,{
        expiresIn: process.env.JWT_EXPIRE_TIME,
    })
}

//method to verify password for login

userSchema.methods.checkPassword = async function(enteredPassword){

    return  await bcrypt.compare(enteredPassword,this.password);
 }

 //method to generate resetPassword token

 userSchema.methods.getResetPasswordToken = function(){

    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken =  crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;
 }

 


const userModel = mongoose.model("user",userSchema);

module.exports = userModel;