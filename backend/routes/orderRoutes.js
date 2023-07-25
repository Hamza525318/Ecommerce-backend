const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/Authentication");
const { newOrder, getSingleOrder, getMyOrders, getAllOrders, changeOrderStatus, deleteOrder } = require("../controllers/orderController");

router.route("/order/new").post(isAuthenticatedUser,newOrder);

router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder);

router.route("/order/me").get(isAuthenticatedUser,getMyOrders);

router.route("/admin/order").get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders);

router.route("/admin/order/:id").put(isAuthenticatedUser,authorizeRoles("admin"),changeOrderStatus);

router.route("/admin/order/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder);





module.exports = router;