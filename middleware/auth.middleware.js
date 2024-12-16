
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const asyncHandler =require('../utils/asyncHandler.js')
const ApiError =require('../utils/Apierror.js')

// const bcrypt = require("bcryptjs");
// const uploadOnCloudinary =require('../utils/cloudniary.js')
// const  Apiresponse=require('../utils/Apiresponse.js')

 exports.verifyjwt= asyncHandler(async(req,res,next)=>{
   try {
     const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")
     if(!token){
         throw new ApiError(401,"unauthorized request")
     }
 
   const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
  const user =await User.findById(decodedtoken?._id).select(
     "-password -refreshtoken")
 console.log("authenticated");
 
     if(!user){
         throw new ApiError(404,"invalid access token")
     }
 
     req.user=user;
     next();

   } catch (error) {
    throw new ApiError(401,"error")
   }


})

