const express = require("express");
const RegisterUserRouter = express.Router();
const RegisterUserController = require("../controller/RegisterUserController");

//registerUser
RegisterUserRouter.post("/registeruserpost", RegisterUserController.RegisteredUser);
//loginUser
RegisterUserRouter.post("/login",RegisterUserController.userLogin);
//logout
RegisterUserRouter.get("/logout",RegisterUserController.logoutUser);
//sending mail from the backend
RegisterUserRouter.post("/sendmail",RegisterUserController.sendMail);


module.exports = RegisterUserRouter;
