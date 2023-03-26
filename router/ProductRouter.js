const express = require("express");
const ProductRouter = express.Router();
const ProductController = require("../controller/ProductController");

//store products
ProductRouter.post("/storeproducts",ProductController.storeproductss);
//get all products
ProductRouter.get("/getallproducts",ProductController.getAllProduct);
//update product
ProductRouter.put("/updateproduct/:_id",ProductController.updateProduct);
//delete product
ProductRouter.delete("/deleteproduct/:_id",ProductController.deleteTheProducts);
// get particular products
ProductRouter.get("/particularproduct/:_id",ProductController.particularProduct);






module.exports = ProductRouter;
