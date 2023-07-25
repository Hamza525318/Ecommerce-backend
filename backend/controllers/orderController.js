const Order = require("../models/OrderModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncErrors = require("../middleware/asyncError");
const Product = require("../models/productModel");


//create order Route 
exports.newOrder = asyncErrors(async (req,res,next)=>{
    const{
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        user: req.user._id,
        OrderPlacedAt:Date.now(),
        
    })

    res.status(201).json({
        success:true,
        order,
    })
})

//Fetch single order route
exports.getSingleOrder  = asyncErrors(async (req,res,next)=>{
    
    const order = await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new ErrorHandler("Could not find the order with the given id",404));
    }
    
    res.status(200).json({
        success:true,
        order
    })

})



//routes for getting all orders of a logged in user
exports.getMyOrders = asyncErrors(async (req,res,next)=>{

    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success: true,
        orders,
    })
})

//get all orders for admin , ADMIN route
exports.getAllOrders = asyncErrors(async (req,res,next)=>{

    const orders = await Order.find();

    let total = 0;

    orders.forEach((order)=>{
        total = total + order.totalPrice
    })


    res.status(200).json({
        success: true,
        total,
        orders,
    })
})

//update OrderStatus - admin route
exports.changeOrderStatus = asyncErrors(async (req,res,next)=>{

    const order = await Order.find(req.params.id);

    if(order.OrderStatus === "delivered"){
        return next( new ErrorHandler("You have aldready delivered this order",400));
    }

    order.orderItems.forEach(async (order)=>{

       await updateStock(order.product,order.quantity);
    })

    order.OrderStatus = req.body.status;

    if(req.body.status == "delivered"){
        order.DeliveredAt = Date.now();
    }

    await order.save({validateBeforeSave: false});
 

    res.status(200).json({
        success:true,
        message: "order updated successfully",
    })


})

//update the quantity of products when delivered
async function updateStock(productId,qty){

    const product = await Product.findById(productId);

    product.qty = product.qty - qty;

    await product.save({validateBeforeSave: false});
}


//delete the order - admin route
exports.deleteOrder = asyncErrors(async (req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found",404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
    })
})
