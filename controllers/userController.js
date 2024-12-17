const User = require("../Model/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tour = require("../Model/tour.js");
const asyncHandler= require('../utils/asyncHandler.js')
const ApiError =require('../utils/Apierror.js')
const  Apiresponse=require('../utils/Apiresponse.js');
const nodemailer = require("nodemailer");
require('dotenv').config();

// const cookieParser=  require('cookie-parser')

const tempUserStore = {};
// Function to generate OTP
const generateOTP=(length)=> {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}
console.log("auth",process.env.EMAIL) 
console.log("auth",process.env.PASSWORD) 
// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.PASSWORD, 
  },
  tls: {
    rejectUnauthorized: false,
  },
});


const GenerateAccessandRefreshtoken = async (userid) => {
  try {
    console.log("uid",userid);

    const user = await User.findById(userid)
    const refreshtoken = user.generateRefreshToken()
    const accesstoken = user.generateAccessToken()

    user.refreshtoken = refreshtoken
    await user.save({ validateBeforeSave: false })
    console.log("token",refreshtoken,accesstoken);
    
    return { accesstoken, refreshtoken }
  } catch (error) {
    throw new ApiError(500, "somethng went wrog while generating refresh and access token")
  }
}
const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  console.log("data",name,email,password);
  
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields (name, email, password) are required");
  }

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
console.log(existingUser);

  // Generate OTP
  const otp = generateOTP(4);
  console.log(otp);
  
  // Temporarily store the user info along with OTP (to be verified later)
  tempUserStore[email] = { name, email, password, otp };
  
  // Send OTP via email
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Hello! ${name}, Please Verify Your OTP`,
    html: `<strong>Your OTP code is: ${otp}</strong>`,
  };
  console.log("main",mailOptions);
  

  try {
    const data= await transporter.sendMail(mailOptions);
    console.log("data",data);
    
    res.status(200).json(new Apiresponse(200, email, "OTP sent successfully"));
  } catch (error) {
    throw new ApiError(500, `Error while sending OTP: ${error}`);
  }
});

// OTP verification endpoint
const verifyOtp = asyncHandler(async (req, res, next) => {

  const { email,otp } = req.body;
  console.log("aya",req.body);

  // Check if the OTP exists in the temporary store
  const storedUser = tempUserStore[email];
  if (!storedUser) {
    throw new ApiError(400, "No OTP request found for this email");
  }

  // Validate OTP
  if (storedUser.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  // OTP is valid, create user
  const { name, password } = storedUser;

  // Hash the password
  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create and save the new user
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  // Clear the temporary store
  delete tempUserStore[email];
  console.log("user",newUser);

  const {accesstoken,refreshtoken}=await GenerateAccessandRefreshtoken(newUser?._id)
  console.log("aya",accesstoken,refreshtoken);

  // Return the created user without sensitive data
  const createdUser = await User.findById(newUser._id).select("-password -refreshtoken");
  
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  const options = {
    httpOnly: true,
    secure: true,
  }
  res
  .status(201)
  .cookie("accesstoken", accesstoken, options)
  .cookie("refreshtoken", refreshtoken, options)
  .json(new Apiresponse(
    200,{
      success: true,
     user:{accesstoken,refreshtoken,createdUser},
     message: 'OTP verified successfully'})
    )});



const getAllPackages =asyncHandler( async (req, res) => {
  console.log("hello");
  
    const packages = await Tour.find();
    console.log("all package backend",packages);
    res
    .status(200)
    .json(new Apiresponse( 200,packages,"getting all package"))
   
});


const login =asyncHandler( async (req, res,next) => {
    const { email, password } = req.body;
    console.log("check",req.body);

    console.log("email,pass",email,password);

    // Find the user by email
    const user = await User.findOne({ email });
    console.log("user",user);
    
    if (!user) {
      throw new ApiError("Invalid email or password" );
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    
    if (!isMatch) {
      throw new ApiError(400," Invalid email or password")
    }

    const { accesstoken, refreshtoken } = await  GenerateAccessandRefreshtoken(user._id)
  console.log("accesstoken refreshtoken", accesstoken, refreshtoken);

  const loggedinuser = await User.findById(user._id).select("-password -refreshtoken")
  console.log("loggedin user", loggedinuser);

  // only modify by the server not the client
  const options = {
    httpOnly: true,
    secure: true,
  }

    // Send response with token
    res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json( new Apiresponse(
      200,{
        user: {loggedinuser, accesstoken, refreshtoken}}
      ,"user logged in successfully"
    ));

});

const logout = asyncHandler(async (req, res,next) => {
  console.log("user data", req.user);

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshtoken: null
      }
    }
  )


  const options = {
    httpOnly: true,
    secure: true,
  }

  res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new Apiresponse(200, {}, "successfull logout"))
})

const refreshaccesstoken = asyncHandler(async (req, res,next) => {

  const IncomingRefreshToken = req.cookies.refreshtoken || req.body.refreshtoken

  if (!IncomingRefreshToken) {
    throw new ApiError(401, "unauthorized")
  }

  const DecodedToken = jwt.verify(IncomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

  const user = await User.findById(DecodedToken?._id)

  if (!user) {
    throw new ApiError(401, "invalid refresh token")
  }


  if (IncomingRefreshToken !== user.refreshtoken) {
    throw new ApiError(401, "token is used or expired")
  }

  const options = {
    httpOnly: true,
    secure: true
  }

  const { accesstoken, Newrefreshtoken } = await GenerateAccessandRefreshtoken(user._id)


  res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", Newrefreshtoken, options)
    .json(new Apiresponse(200,
      {
        accesstoken,
        refreshtoken: Newrefreshtoken
      },
      "refresh token generated"))

})

module.exports= {
  signup,
  login,
  logout,
  refreshaccesstoken,
  getAllPackages,
  verifyOtp
}
