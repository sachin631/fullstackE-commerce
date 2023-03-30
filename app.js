require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const RegisterUserRouter=require("./router/RegisterUserRouter");
const ProductRouter = require("./router/ProductRouter");
require("./DBconnection/conn");
const bodyParser = require("body-parser");


app.use(express.json());
app.use(bodyParser.json());
app.use(cors())
app.use(cookieParser(""));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(ProductRouter);//router ko last mae rkhna h ye issue
app.use(RegisterUserRouter);

app.listen(process.env.PORT, () => {
  console.log(`server start properly at  ${process.env.PORT}`);
});
