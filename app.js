require("dotenv").config();
const express = require("express");
const app = express();
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const userRouter = require("./router/userRouter");
const ProductRouter = require("./router/ProductRouter");
require("./DBconnection/conn");
const bodyParser = require("body-parser");



app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(ProductRouter);//router ko last mae rkhna h ye issue

app.listen(process.env.PORT, () => {
  console.log(`server start properly at  ${process.env.PORT}`);
});
