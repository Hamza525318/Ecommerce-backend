const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncErrorHandler = require("../middleware/asyncError");
const ApiFeatures = require("../utils/ApiFeatures");

//create a product
exports.createProduct = asyncErrorHandler(async (req,res,next)=>{
    
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
       success:true,
       product,
    })

});

//fetch all products
exports.getAllProducts = asyncErrorHandler(async (req,res)=>{
    
    const resultPerPage = 1;
    const productCount = await Product.countDocuments();
    const ApiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage); 
    const products = await  ApiFeature.query;

    

    if(!products){
        return next(new ErrorHandler("no products to be fetched",404));
    }
    res.status(200).json({
        productCount,   //doubt
        products,
        message:"fetched all products successfully",
    })


})

//update a product
exports.updateProduct = asyncErrorHandler(async (req,res,next)=>{

    let product = await Product.findById(req.params.
        id);

    if(!product){
        return next(new ErrorHandler("product not found",404));
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});

    res.status(200).json({
        success:true,
        product
    })

    console.log("product name");
})

//delete a single product
exports.deleteProduct = asyncErrorHandler(async (req,res,next)=>{
     
    let product = Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product not found",404));
    }

    await product.findOneAndRemove();

    res.status(200).json({
    
        success:true,
        message:"product deleted successfully",
    })
})

exports.fetchProductDetails = asyncErrorHandler(async (req,res,next)=>{

    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not found",404));
    }

    res.status(200).json({
    
        success:true,
        product
    })
});

//route create product review or update Product Review
exports.createProductReview = asyncErrorHandler(async (req,res,next)=>{

    const{rating,comment,productId} = req.body;
     const{name} = req.user;
    const review = {
        user: req.user._id,
        user:name,
        rating: Number(rating),
        comment: comment,
    }

    const product = await Product.findById(productId);
    

    const isReviewed = product.reviews.find(rev=> rev.user.toString() === req.user._id.toString()); 


    if(isReviewed){
       
      product.reviews.forEach((rev)=>{

          if(rev.user.toString() === req.user._id.toString()){
             rev.rating = rating;
             rev.comment = comment;
          }
      })    

    }
    else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    
     product.reviews.forEach((rev)=>{
        avg = avg + rev.rating;
    });

    product.ratings = (avg/product.reviews.length);
    
    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
    })

})

//get all product reviews
exports.getAllProductReviews = asyncErrorHandler(async (req,res,next)=>{

    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })

})

exports.deleteReview = asyncErrorHandler(async (req,res,next)=>{
        
      const product = await Product.findById(req.query.productId);
      
      if(!product){
        return next(new ErrorHandler("Product not found",404));
      }

      const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

      let avg = 0;

     reviews.forEach((rev)=>{
        avg = avg + rev.rating;
     });

    const ratings = (avg/reviews.length);
    
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews: reviews,
        ratings: ratings,
        numOfReviews: numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

    await product.save();

    res.status(200).json({
        success:true,
    })


})