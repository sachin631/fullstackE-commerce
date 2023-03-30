const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel/RegisterUserModel");

exports.userAuthentication = async (req, res, next) => {
  try {
    const token = req.cookies.FullStackCookie;
    const verifyToken = jwt.verify(token, process.env.secretKey);
    console.log(verifyToken);

    const rootuser = await userModel.findOne({
      _id: verifyToken._id,
    });
    console.log(rootuser);

    if (!rootuser) {
      throw new Error("user not found authniticatate.js");
    }

    req.token = token;
    req.rootuser = rootuser;
    req.userId = rootuser._id;
    next();
  } catch (error) {
    res.status(401).json("error in authenticate.js");
    console.log(error);
  }
};

exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.rootuser.role)) {
      next();
    } else {
      throw new Error("Only Admin can access this ");
    }
  };
};
