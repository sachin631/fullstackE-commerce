const RegisterUserModel = require("../models/userModel/RegisterUserModel");
const bcrypt = require("bcryptjs");

//registerUserLogin
exports.RegisteredUser = async (req, res) => {
  const { name, phoneNumber, email, passWord, re } = req.body;

  try {
    if (!name || !phoneNumber || !email || !passWord || !passWord) {
      res
        .status(400)
        .json({ success: false, error: "please fill all fields!" });
    } else {
      if (passWord === re) {
        const RegisteredUser = await RegisterUserModel({
          name,
          phoneNumber,
          email,
          passWord,
          re,
        });
        const finalUserData = await RegisteredUser.save();
        res.status(200).json({ success: true, RegisteredUser: finalUserData });
      } else {
        res
          .status(400)
          .json({ message: "password and re-Password Not matched !" });
      }
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//userLogin api
exports.userLogin = async (req, res) => {
  const { email, passWord } = req.body;

  if (!email || !passWord) {
    res.status(400).json({ message: "please enter data in all fields" });
  }
  try {
    const data = await RegisterUserModel.findOne({ email: email });
    if (data) {
      const isUser = await bcrypt.compare(passWord, data.passWord);

      if (isUser) {
       //generate Token AFter UserFound
       const token=await data.tokenGeneration();
       //generate the cookie
       res.cookie("FullStackCookie",token,{
        expires:new Date(Date.now()+90000000)
       })
       
        res.status(200).json({ message: "userFound",token:token });
      } else {
        res.status(400).json({ message: "please enter valid password" });
      }
    } else {
      res.status(400).json({ message: "please enter valid details" });
    }
  } catch (error) {
    res.status(400).json({ error });
    console.log(error);
  }
};
