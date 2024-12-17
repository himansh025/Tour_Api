const User = require("../Model/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tour = require("../Model/tour.js");
const asyncHandler= require('../utils/asyncHandler.js')
const ApiError =require('../utils/Apierror.js')
const  Apiresponse=require('../utils/Apiresponse.js');


const GenerateAccessandRefreshtoken = async (userid) => {
  try {
    const user = await User.findById(userid)
    const refreshtoken = user.generateRefreshToken()
    const accesstoken = user.generateAccessToken()

    user.refreshtoken = refreshtoken
    await user.save({ validateBeforeSave: false })
    return { accesstoken, refreshtoken }
  } catch (error) {
    throw new ApiError(500, "somethng went wrog while generating refresh and access token")
  }
}

const getAllPackages =asyncHandler( async (req, res) => {
  console.log("hello");
  
    const packages = await Tour.find();
    console.log("all package backend",packages);
    res
    .status(200)
    .json(new Apiresponse( 200,packages,"getting all package"))
   
});

const signup = asyncHandler(async (req, res,next) => {
console.log("hello",req.body);

    const { name, email, password } = req.body;
    console.log("hello",name);

    if (!name || !email || !password) {
    throw new ApiError(400, "All fields (name, email, password) are required")}

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already exists")
    }
    

    // Hash the password
    let hashedPassword;
  if (password) {
    const genSalt = 8;
    const salt = await bcrypt.genSalt(genSalt);
    hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
  }

    // Create and save the new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const createduser = await User.findById(newUser._id).select(
      "-password -refreshtoken"
    )
    console.log("created user", createduser);

    if (!createduser) {
      throw new ApiError(500, "something wents wrong while registering the user ")
    }
  
    // Send success response
    res
    .status(201)
    .json( new Apiresponse( createduser, "user registered succesfully"));
 
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
        user: loggedinuser, accesstoken, refreshtoken}
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
}
