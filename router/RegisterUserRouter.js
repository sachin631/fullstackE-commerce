const express = require("express");
const RegisterUserRouter = express.Router();
const RegisterUserController = require("../controller/RegisterUserController");

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


module.exports = RegisterUserRouter;
