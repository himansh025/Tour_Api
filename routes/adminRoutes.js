const express = require("express");
const upload = require("../middleware/multer.middleware.js");

const {

  createTour,
  updateTour,
  deleteTour,
  getAllBookings,
  updateBooking,
  deleteBooking
} = require("../controllers/adminController.js");

const router = express.Router();
// router.post("/adminlogin", login); 
// router.post("/adminlogout", logout); 
// router.post("/signupadmin", signup); 

router.post('/addtour', upload.array('images', 5), createTour);
router.delete("/deletetour/:tourId",deleteTour );
router.patch("/updatetour/:tourId",updateTour);

router.get("/getAllBookings",getAllBookings);

router.patch("/updatebooking/:bkid", updateBooking); 
router.delete("/deletebooking/:bkid", deleteBooking); 


module.exports = router;
