const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:[true,"please enter product name"],
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    qty:{
        type:Number,
        default: 0
    },
    ratings:{
        type:Number,
        required:true,
    },
    images:[
        {
            publicId:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            }
        }
    ],
    numOfReviews:{
        type: Number,
        default: 0,
    },
    reviews:[
        {
            user:{
                type : mongoose.Schema.ObjectId,
                ref: "User",
                required:true,
            },
            rating:{
                type: String,
                required: true,
            },
            comment:{
                type:String,
                required: true,
            }

        }
    ],
    user:{
        type : mongoose.Schema.ObjectId,
        ref: "User",
        required:true,
    },
    createdAt:{
        
        type:Date,
        default:Date.now(),
    }
})

const productModel = mongoose.model("Product",productSchema);
module.exports = productModel; 