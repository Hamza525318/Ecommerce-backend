const express = require("express");
const { registerUser, 
        loginUser, 
        logoutUser, 
        forgotPassword, 
        resetPassword, 
        getUserDetails, 
        updateUserPassword,
        updateProfileDetails,
        getSingleUser,
        getAllUsers,
        updateUserRole,
        deleteUserProfile
    } = require("../controllers/userController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/Authentication");
const router = express.Router();

//register a new user
router.route("/register").post(registerUser);
//login in to the account
router.route("/login").post(loginUser);
//forgot password route
router.route("/password/forgot").put(forgotPassword);
//reset password route
router.route("/password/reset/:token").put(resetPassword);
//logout of account
router.route("/logout").get(logoutUser);

// get a particular user details
router.route("/mydetails").get(isAuthenticatedUser,getUserDetails);
//update password
router.route("/password/update").put(isAuthenticatedUser,updateUserPassword);
//update profile details
router.route("/me/updatedetails").put(isAuthenticatedUser,updateProfileDetails);

//admin route to fetch all users for admin
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers);

//admin route to get singleUser, update role and delete user by admin
 router.route("/admin/user/:id")
 .get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser)
 .put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole)
 .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUserProfile);


module.exports = router;