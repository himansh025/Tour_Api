const express = require("express");
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController.js");

const router = express.Router();

// Booking routes
router.get("/getallpackage", getAllBookings); // Fetch all bookings
router.get("/getpackage/:packageid", getBookingById); // Fetch a specific booking by ID
// router.post("/createBooking/:packageId", createBooking); // Create a new booking

router.post("/createBooking", createBooking); // Create a new booking
router.patch("/updatepackage/:id", updateBooking); // Update an existing booking
router.delete("/deletepackage/:id", deleteBooking); // Delete a booking

module.exports = router;
