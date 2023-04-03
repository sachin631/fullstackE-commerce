const express = require("express");
const RegisterUserRouter = express.Router();
const RegisterUserController = require("../controller/RegisterUserController");
const { userAuthentication } = require("../middleware/userAuthentication");

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

// chnage passWordByProfile
RegisterUserRouter.post("/newpasswordbyprofile",userAuthentication,RegisterUserController.newPassWordByProfile);

module.exports = RegisterUserRouter;

//😊😚😊😊😊😊😊😊😚😊😊😊😊😊😚😊😊😊😊😊😚😊😊😊😊😊😚😊😊😊😊😊😚😊😊😊😊😊😚😊😊😊😊😊😚😊😊😊😊😊😚😊😊😊😊

