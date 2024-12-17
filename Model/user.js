const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  refreshtoken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps:true});


userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,

    // EXPIRY take OBJECT
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {    
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,

    // EXPIRY take OBJECT
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

module.exports = mongoose.model("User", userSchema);
