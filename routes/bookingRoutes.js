const express = require("express");
const {
  getBookingById,
  createBooking,
  // updateTour,
  // deleteBooking
} = require("../controllers/bookingController.js");

const router = express.Router();

// Booking routes
router.get("/getpackage/:packageid", getBookingById);
router.post("/createBooking", createBooking); 
// router.patch("/updatetour/:packageid", updateTour); 
// router.delete("/deletetour/:packageid", deleteBooking) ; 

module.exports = router;
