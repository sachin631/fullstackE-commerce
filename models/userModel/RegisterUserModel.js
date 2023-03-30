const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const RegisterUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter name is mandatory"],
    trim: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
  },
  email: {
    type: String,
    required: [true, "Enter name is mandatory"],
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  passWord: {
    type: String,
    required: true,
  },
  re: {
    type: String,
    required: true,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role:{
    type:String,
    default:"user"
  },
  resetPassWordToken:String,

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  passWordResetToken:{
      type:String
  },
  cart: [],
});

//password hashing

RegisterUserSchema.pre("save", async function (next) {
  if (this.isModified("passWord")) {
    this.passWord = await bcryptjs.hash(this.passWord, 12);
    this.re = await bcryptjs.hash(this.re, 12);
  }
  next();
});

//generate token for user
RegisterUserSchema.methods.tokenGeneration = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.secretKey);
  this.tokens = this.tokens.concat({ token: token });
  this.save();
  return token;
};

//RegisterUserModel
const RegisterUserModel = new mongoose.model(
  "registerusers",
  RegisterUserSchema
);

module.exports = RegisterUserModel;
