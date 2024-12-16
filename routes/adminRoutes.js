const express = require("express");
const {
  addTour,
  updateTour,
  deleteTour,
  getTourById,
  // updateBooking,
  // getAllBookings,
//  signup,
// logout
} = require("../controllers/adminController.js");

const router = express.Router();
// router.post("/adminlogin", login); 
// router.post("/adminlogout", logout); 
// router.post("/signupadmin", signup); 
// router.delete("/addtour", addtour);
// router.delete("/deletetour/:id", deletetour);
// router.get("/bookings", getAllBookings);
// router.delete("/updatetour/:id", updateBooking);
router.post("/addtour", addTour);
router.patch("/updatetour/:id",updateTour);
router.patch("/getTourById/:id",getTourById);
router.delete("/deletetour/:id",deleteTour );

module.exports = router;
