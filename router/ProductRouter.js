const express = require("express");
const ProductRouter = express.Router();
const ProductController = require("../controller/ProductController");
const userAuthentication = require("../middleware/userAuthentication");
// const authorizeRole=require("../middleware/userAuthentication");

//store products
ProductRouter.post("/storeproducts",userAuthentication.userAuthentication,userAuthentication.authorizeRole("admin"),ProductController.storeproductss);
//get all products
ProductRouter.get("/getallproducts",ProductController.getAllProduct);
//update product
ProductRouter.put("/updateproduct/:_id",userAuthentication.userAuthentication,userAuthentication.authorizeRole("admin"),ProductController.updateProduct);
//delete product
ProductRouter.delete("/deleteproduct/:_id",userAuthentication.userAuthentication,userAuthentication.authorizeRole("admin"),ProductController.deleteTheProducts);
// get particular products
ProductRouter.get("/particularproduct/:_id",ProductController.particularProduct);
//search product api
ProductRouter.get("/searchproducts/:key",ProductController.searchProducts);
//pagination of products
ProductRouter.get("/paginationproduct",ProductController.pagination); 






module.exports = ProductRouter;
// 2:42
