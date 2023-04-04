const express = require("express");
const RegisterUserRouter = express.Router();
const RegisterUserController = require("../controller/RegisterUserController");
const  userAuthentication  = require("../middleware/userAuthentication");

//registerUser
RegisterUserRouter.post("/registeruserpost", RegisterUserController.RegisteredUser);
//loginUser
RegisterUserRouter.post("/login",RegisterUserController.userLogin);
//logout
RegisterUserRouter.get("/logout",RegisterUserController.logoutUser);
//sending mail from the backend for password reset purpose
RegisterUserRouter.post("/sendmail",RegisterUserController.sendMail);
//forgotPassword verified the user on belhlaf of id and token is send on emial if this shown error then send page to error page else alow to update password
RegisterUserRouter.get("/forgotpassword/:_id/:token",RegisterUserController.forgotPassword);
//enter New Password after forgot
RegisterUserRouter.post("/:_id/:token",RegisterUserController.newPassWord);

//userProfile change after login like if user want to change the password,profilepic,emial


//get All Details Of User after login
RegisterUserRouter.get("/getuserdetailsafterlogin",userAuthentication.userAuthentication,RegisterUserController.getAllDetailsOfUser);
// chnage passWordByProfile
RegisterUserRouter.post("/newpasswordbyprofile",userAuthentication.userAuthentication,RegisterUserController.newPassWordByProfile);
//updateProfileAfterLogin
RegisterUserRouter.post("/updateProfileAfterLogin",userAuthentication.userAuthentication,RegisterUserController.updateProfileAfterLogin);

//if admin want to get all details of user
RegisterUserRouter.get("/admin/allregistereduserdetails",userAuthentication.userAuthentication,userAuthentication.authorizeRole("admin"),RegisterUserController.allRegisteredUserDetails);
//get single user data for admin
RegisterUserRouter.get("/admin/getparticularuserdata/:_id",userAuthentication.userAuthentication,userAuthentication.authorizeRole("admin"),RegisterUserController.getParticularUserDataForAdmin);
//update Role for admin 
RegisterUserRouter.put("/admin/updateRole/:_id",userAuthentication.userAuthentication,userAuthentication.authorizeRole("admin"),RegisterUserController.updateRole);
//delete user from admin
RegisterUserRouter.delete("/admin/deleteuserfromadmin/:_id",userAuthentication.userAuthentication,userAuthentication.authorizeRole("admin"),RegisterUserController.deleteUserFromAdmin);

module.exports = RegisterUserRouter;


