const express = require("express");
const userRouter = express.Router();
const usercontroler = require("../controller/userController");

userRouter.post("/userpost", usercontroler.userpostData);

module.exports = userRouter;
