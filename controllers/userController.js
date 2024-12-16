const User = require("../Model/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const uploadOnCloudinary =require('../utils/cloudinary.js')
const asyncHandler= require('../utils/asyncHandler.js')
const ApiError =require('../utils/Apierror.js')
const  Apiresponse=require('../utils/Apiresponse.js');
// const { deleteTour } = require("./adminController.js");


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


// Signup - Create a new user
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

// Login - Authenticate the user
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


// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Fetch user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user (Admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user details (Admin only or user)
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports= {
  signup,
  login,
  logout,
  getAllUsers,
  getUserById,
  refreshaccesstoken,
  deleteUser,
  updateUser,
  createUser
}
