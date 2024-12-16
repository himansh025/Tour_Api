const express = require("express");
const {
  getAllUsers,
  getUserById,
  signup,
  login,
  logout,
  deleteUser,
  // createUser,
  // updateUser
} = require("../controllers/userController.js");

const router = express.Router();

// User routes
router.post("/signup", signup); // User signup
router.post("/login", login); 
router.post("/logout", logout); 

router.get("/", getAllUsers); // Fetch all users
router.get("/:id", getUserById); // Fetch a specific user by ID

// router.post("/", createUser); // Create a new user
// router.patch("/:id", updateUser); // Update a user
router.delete("/:id", deleteUser); // Delete a user

module.exports = router;
