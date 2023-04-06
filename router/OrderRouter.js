const express=require("express");
const orderRouter=express.Router();
const orderController=require("../controller/orderController");
const userAuthentication=require("../middleware/userAuthentication");


//create User Order
orderRouter.post("/createuserorder",userAuthentication.userAuthentication,orderController.createUserOrder);
orderRouter.get("/getsingleorder/:_id",userAuthentication.userAuthentication,orderController.getSingleorder);

   
module.exports=orderRouter; 