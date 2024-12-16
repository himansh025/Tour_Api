const express = require("express");
const upload = require("../middleware/multer.middleware.js");

const {
  getAllPackages,
  createPackage,
  getPackageById,
  updatePackage,
  deletePackage,
} = require("../controllers/packageController.js");

const router = express.Router();
router.get("/getallpackages", getAllPackages); // Get all packages 
router.get("/:id", getPackageById); // Get a package by ID
router.post('/addtour', upload.array('images', 5), createPackage);
router.put("/update/:id", updatePackage);// Update a package
router.delete("/delete/:id", deletePackage);// Delete a package

module.exports = router;
