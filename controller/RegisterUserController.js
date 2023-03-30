const RegisterUserModel = require("../models/userModel/RegisterUserModel");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken");

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
          avatar: {
            public_id: "avatar id",
            url: "avatr url",
          },
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
        const token = await data.tokenGeneration();
        //generate the cookie
        res.cookie("FullStackCookie", token, {
          expires: new Date(Date.now() + 90000000),
          httpOnly: true,
        });

        res.status(200).json({ message: "userFound", token: token });
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

//logout api
exports.logoutUser = (req, res) => {
  try {
    // res.clearCookie("FullStackCookie");
    res.cookie("FullStackCookie", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(201).json();
  } catch (error) {
    res
      .status(400)
      .json({ message: "Something goes Wrong try to logout again !" });
  }
};

//email configuration createTransport // maileroption //sendMail

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

//maileroption

//sendMail

//create the sending mail api
exports.sendMail = async (req, res) => {
  try {
    const { email } = req.body;

    const isUser = await RegisterUserModel.findOne({ email: email });

    if (isUser) {
      const resetPassWordToken = jwt.sign(
        { _id: isUser._id },
        process.env.secretKey,
        {
          expiresIn: "120s",
        }
      );
      // console.log(resetPassWordToken);
      const setUserToken = await RegisterUserModel.findByIdAndUpdate(
        isUser._id,
        { passWordResetToken: resetPassWordToken },
        { new: true }
      );
      res.send(setUserToken);

      if (setUserToken) {
        const mailerOption = {
          from: "sangwansachin631@gmail.com",
          to: req.body.email,
          subject: "Reset Your PassWord",
          text: ` this link is only valid for 2 minutes http://localhost:3000/${isUser._id}/${setUserToken.passWordResetToken}`,
        };

         transporter.sendMail(
          mailerOption,
          (error, info) => {
            if (error) {
              res.status(400).json({ error: error });
            } else {
              console.log("email sent", info.response);
              res
                .status(200)
                .json({ message: "mail is sent to the user Successfuly" });
            }
          }
        );
      } else {
        console.log("token is not updated yet");
      }
    } else {
      res
        .status(400)
        .json({ message: "user Email is Invalid . please Enter valid user" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


//https://youtu.be/T6sBAXGwhgw
//1:00 harsh pathak