//creating all routes for product page.
const express = require("express");
const { getAllProducts,createProduct,updateProduct, deleteProduct, fetchProductDetails, createProductReview, getAllProductReviews, deleteReview} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/Authentication");
const router = express.Router();

//fetch all product
router.route("/products").get(getAllProducts);

//add a new product
router.route("/admin/products/new").post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);

//update a product
router.route("/admin/products/:id")
.put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)

router.route("/products/:id").get(fetchProductDetails);

//create and update review 
router.route("/reviews").put(isAuthenticatedUser,createProductReview);

router.route("/getreviews").get(isAuthenticatedUser,getAllProductReviews);
router.route("/deletereview").delete(isAuthenticatedUser,deleteReview);


module.exports =  router;

