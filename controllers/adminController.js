const Booking = require("../Model/booking.js");
const Tour = require("../Model/tour.js");
const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/Apierror.js");
const ApiResponse = require("../utils/Apiresponse.js");
const uploadOnCloudinary = require('../utils/cloudinary.js')


// Add a new tour

const createTour = asyncHandler(async (req, res) => {
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


// Update a tour
const updateTour = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedTour = await Tour.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedTour) {
    throw new ApiError(404, "Tour not found");
  }

  res.status(200).json(new ApiResponse(200, updatedTour, "Tour updated successfully"));
});

// Delete a tour
const deleteTour = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedTour = await Tour.findByIdAndDelete(id);
  if (!deletedTour) {
    throw new ApiError(404, "Tour not found");
  }

  res.status(200).json(new ApiResponse(200, {}, "Tour deleted successfully"));
});


// Update booking
const updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedBooking) {
    throw new ApiError(404, "Booking not found");
  }

  res.status(200).json(new ApiResponse(200, updatedBooking, "Booking updated successfully"));
});
// Update booking
const getAllBookings = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedBooking) {
    throw new ApiError(404, "Booking not found");
  }

  res.status(200).json(new ApiResponse(200, updatedBooking, "Booking updated successfully"));
});

module.exports = {
  createTour,
  updateTour,
  deleteTour,
  updateBooking,
  getAllBookings
  // getTourById,
};
