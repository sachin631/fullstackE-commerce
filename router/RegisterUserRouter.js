const express = require("express");
const RegisterUserRouter = express.Router();
const RegisterUserController = require("../controller/RegisterUserController");

//registerUser
RegisterUserRouter.post("/registeruserpost", RegisterUserController.RegisteredUser);
//loginUser
RegisterUserRouter.post("/login",RegisterUserController.userLogin);


module.exports = RegisterUserRouter;
