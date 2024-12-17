const express = require("express");
const upload = require("../middleware/multer.middleware.js");

const {
  createTour,
  updateTour,
  deleteTour,
  // updateBooking,
  // getAllBookings,
  
  // updateBooking,
} = require("../controllers/adminController.js");

const router = express.Router();
// router.post("/adminlogin", login); 
// router.post("/adminlogout", logout); 
// router.post("/signupadmin", signup); 

router.post('/addtour', upload.array('images', 5), createTour);
// router.get("/getAllBookings",getAllBookings);
router.patch("/updatetour/:tourId",updateTour);
router.delete("/deletetour/:tourId",deleteTour );
// router.patch("/updatebooking/:packageid", updateBooking); 


module.exports = router;
