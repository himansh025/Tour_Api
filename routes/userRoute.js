const express = require("express");
// const verifyjwt= require('../middleware/auth.middleware.js')
const {
  signup,
  login,
  logout,
  getAllPackages,
  verifyOtp,
  refreshaccesstoken
  // getAllUsers,
  // getUserById,
} = require("../controllers/userController.js");

const router = express.Router();

// User routes
router.post("/signup", signup); // User signup
router.post("/login", login); 
router.post("/logout", logout); 
router.post('/verifyotp',verifyOtp);
router.post("/refreshtoken", refreshaccesstoken); 
router.get("/getallpackages", getAllPackages); // Get all packages 

// router.get("/", getAllUsers); // Fetch all users
// router.get("/:id", getUserById); // Fetch a specific user by ID


module.exports = router;
