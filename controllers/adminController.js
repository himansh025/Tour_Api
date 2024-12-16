const Booking = require("../Model/booking.js");
const Tour = require("../Model/tour.js");
const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/Apierror.js");
const ApiResponse = require("../utils/Apiresponse.js");

// Add a new tour
const addTour = asyncHandler(async (req, res) => {
  const { title, description, price, duration, locations } = req.body;

  if (!title || !description || !price || !duration || !locations) {
    throw new ApiError(400, "All fields (title, description, price, duration, locations) are required");
  }

  const newTour = await Tour.create({ title, description, price, duration, locations });

  res.status(201).json(new ApiResponse(201, newTour, "Tour added successfully"));
});

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

// Get tour by ID
const getTourById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);
  if (!tour) {
    throw new ApiError(404, "Tour not found");
  }
  res.status(200).json(new ApiResponse(200, tour, "Tour fetched successfully"));
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

module.exports = {
  addTour,
  updateTour,
  deleteTour,
  getTourById,
  updateBooking,
};
