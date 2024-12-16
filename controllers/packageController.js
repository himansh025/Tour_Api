const Tour = require("../Model/tour.js");
const asyncHandler = require("../utils/asyncHandler.js");
const Apiresponse = require("../utils/Apiresponse.js");
const ApiError =require('../utils/Apierror.js')
const uploadOnCloudinary = require('../utils/cloudinary.js')


// Get all packages
const getAllPackages =asyncHandler( async (req, res) => {
  console.log("hello");
  
    const packages = await Tour.find();
    console.log("all package backend",packages);
    res
    .status(200)
    .json(new Apiresponse( 200,packages,"getting all package"))
   
});

// Get a specific package by ID
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const package = await Tour.findById(id);
    if (!package) return res.status(404).json({ message: "Package not found" });
    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ message: "Error fetching package", error });
  }
};


const createPackage = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  // console.log("files",req.files);
  const { title, description, price,date, duration, location } = req.body;
  console.log("files",req.files);
  // console.log(req.user._id);
  const images=req.files;
  console.log(title ,description ,price ,duration ,date, location);
  
if (!( title && description && price && duration && date  && location)) {
      throw new ApiError(500, "all are  req")
  }
  // if (!images || images.length === 0) {
  //   throw new ApiError(400 , 'Please upload images.')
  // }

console.log("agaya");


  // const uploadedImages = [];
  // for (let i = 0; i < images.length; i++) {
  //   const filePath = images[i].path; // Path to the uploaded image
  //   const cloudinaryResponse = await uploadOnCloudinary(filePath);
  //   if (cloudinaryResponse) {
  //     uploadedImages.push(cloudinaryResponse.url); // Save the image URL returned by Cloudinary
  //   }
  // }
  
  // const owner = await User.findById(req.user?._id);
  // if(!owner){
  //     throw new ApiError(400 , "User authentication is required");
  // }

  // console.log("owner  vd",owner);
  
  const newPackage = await  Tour.create({
    title,
    description,
    price,
    location,
    image: '',
    date,
    duration
  });

// console.log("tour package created",newPackage);
newPackage.save()
console.log(' document',newPackage);

  res
  .status(200)
  .json(new Apiresponse( 200,newPackage,"added package"))
})


// Update a package
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedPackage = await Tour.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: "Error updating package", error });
  }
};

// Delete a package
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPackage = await Package.findByIdAndDelete(id);

    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting package", error });
  }
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
