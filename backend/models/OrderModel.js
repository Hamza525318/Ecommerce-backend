const mongoose = require("mongoose");
const validator = require("validator");

const orderSchema = new mongoose.Schema({

    shippingInfo:{
        address:{
            type:String,
            required:true,
        },
        State:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            required:true,
        },
        pincode:{
            type: Number,
            required:true,
            minlength:[6,"PINCODE SHOULD BE OF 6 DIGITS"],
            maxlength:[6,"PINCODE SHOULD BE OF 6 DIGITS"],
        },
        phoneNo:{
            type:Number,
            required:true,
            minlength:[10,"PHONE NUMBER SHOULD BE 10 DIGITS"]
        }
    },

    orderItems:[
        {
            name:{
                type:String,
                required:true,
            },
            price:{
                type:Number,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            },
            image:{
                type:String,
                required:true,
            },
            product:{
               type: mongoose.Schema.ObjectId,
               ref:"Product",
               required:true,
            }

        }
    ],

    user:{
       
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required:true,
    },

    itemsPrice:{
        type:Number,
        required:true,
        default: 0,
    },

    taxPrice:{
        type:Number,
        required:true,
        default: 0,
    },
    shippingPrice:{
        type:Number,
        required:true,
        default:0
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0.
    },
    OrderStatus:{
        type:String,
        required: true,
        default: "In making",
    },
    DeliveredAt: Date,
    OrderPlacedAt:{
        type:Date,
        default: Date.now(),
    }

})

const Order = mongoose.model("Order",orderSchema);
module.exports = Order;