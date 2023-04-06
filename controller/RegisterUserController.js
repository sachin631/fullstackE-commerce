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

//  userLogin api
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
          expiresIn: "1d",
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

        transporter.sendMail(mailerOption, (error, info) => {
          if (error) {
            res.status(400).json({ error: error });
          } else {
            console.log("email sent", info.response);
            res
              .status(200)
              .json({ message: "mail is sent to the user Successfuly" });
          }
        });
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

exports.forgotPassword = async (req, res) => {
  const { _id, token } = req.params;
  console.log("id token is ", _id, token);

  try {
    const verifiedUser = await RegisterUserModel.findOne({
      _id: _id,
      passWordResetToken: token,
    });
    console.log(verifiedUser); //proclem herre

    const verifingToken = jwt.verify(token, process.env.secretKey);
    console.log("veryfing token", verifingToken);

    if (verifiedUser && verifingToken._id) {
      res.status(200).json({ verifiedUser: verifiedUser });
    } else {
      res
        .status(400)
        .json({ message: "user not exist please enter valid data" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// enter new  password api work on click
exports.newPassWord = async (req, res) => {
  //we have to verify the user and token agin here beacuase when user spend more then 2 min after react at newpasssword page then it shown token expire error
  const { passWord } = req.body;
  const { _id, token } = req.params;

  try {
    const validUser = await RegisterUserModel.findOne({
      _id: _id,
      passWordResetToken: token,
    });
    const verifiedToken = jwt.verify(token, process.env.secretKey);

    if (validUser && verifiedToken._id) {
      const newHashPassWord = await bcrypt.hash(passWord, 12);
      const findUser = await RegisterUserModel.findByIdAndUpdate(
        { _id: _id },
        { passWord: newHashPassWord }
      );
      console.log("sachin", findUser);
      findUser.save();
      res.status(200).json({ user: findUser });
    } else {
      res.status(200).json({ user: "userNotfound" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// After login change user details when click on its profile

//get all details of the login user
exports.getAllDetailsOfUser = async (req, res) => {
  try {
    const user = req.rootuser._id;
    const userfound = await RegisterUserModel.findOne(user);
    res.status(201).json({ success: true, userfound: userfound });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

// chnage passWordByProfile
exports.newPassWordByProfile = async (req, res) => {
  try {
    const user = req.rootuser._id;
    const { newPassWordByProfile } = req.body;
    console.log(newPassWordByProfile);
    const { newRepeatPassWordProfile } = req.body;
    console.log(newRepeatPassWordProfile);

    if (newPassWordByProfile === newRepeatPassWordProfile) {
      const nextPassWord = await bcrypt.hash(newPassWordByProfile, 12);
      console.log(nextPassWord);
      const nextRepeatPassWord = await bcrypt.hash(
        newRepeatPassWordProfile,
        12
      );
      console.log(nextRepeatPassWord);

      const updateUserPassWord = await RegisterUserModel.findByIdAndUpdate(
        user,
        {
          passWord: nextPassWord,
          re: nextRepeatPassWord,
        },
        { new: true } //to retunr updateed document must use new true
      );
      res.status(201).json({ message: updateUserPassWord });
    } else {
      res.status(400).json({ error: "Passwords do not match" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//update userprofile after login like email,name,phoneNumber and avtar of user
exports.updateProfileAfterLogin = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const { _id } = req.rootuser;
    if (name && email && phoneNumber) {
      const updateProfile = await RegisterUserModel.findByIdAndUpdate(
        _id,
        { name: name, email: email, phoneNumber: phoneNumber },
        { new: true }
      ); //adding new true to solve the problem of updaditing after double click on send button in postman
      res.status(201).json({ message: updateProfile });
    } else {
      res
        .status(400)
        .json({ success: false, error: "please Enter all details" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

//get all user for admin data manipuldation
exports.allRegisteredUserDetails = async (req, res) => {
  try {
    const user = await RegisterUserModel.find();
    res.status(201).json({ success: true, user: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

//get particular user by admin
exports.getParticularUserDataForAdmin = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await RegisterUserModel.findOne({ _id: _id });

    res.status(201).json({ success: true, user: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//update user admin roles
exports.updateRole = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const { name, email, phoneNumber, role } = req.body;
    const updateUserData = await RegisterUserModel.findByIdAndUpdate(
      _id,
      { name: name, email: email, phoneNumber: phoneNumber, role: role },
      { new: true }
    );
    res.status(201).json({ success: true, user: updateUserData });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//deleteUserFrom admin panel
exports.deleteUserFromAdmin = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const deletedUser = await RegisterUserModel.deleteOne({ _id: _id });
    res.status(201).json({ success: true, deleteduser: deletedUser });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

