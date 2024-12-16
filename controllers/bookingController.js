const Booking = require("../Model/booking.js");
const asyncHandler= require('../utils/asyncHandler.js')
const ApiError =require('../utils/Apierror.js')
const  Apiresponse=require('../utils/Apiresponse.js')
const {generateInvoice}= require('../utils/generateInvoice.js')



const getAllBookings =asyncHandler( async (req, res) => {
 
    const bookings = await Booking.find().populate("packageId").populate("userId");
    res
    .status(200)
    .json(new Apiresponse(200,bookings,"all the bookings getted"));
  
})  

// Get a specific booking by ID
const getBookingById =asyncHandler( async (req, res) => {

    const { id } = req.params;
    const booking = await Booking.findById(id).populate("packageId").populate("userId");
    if (!booking) {
      throw new ApiError(400, "Booking not found")
    }

    res
    .status(200)
    .json(new Apiresponse(200,booking,"  bookings by id "));

});

// Create a new booking

const createBooking = asyncHandler(async (req, res) => {
    // Destructure fields from the request body
    // const {tourPackageId}= req.params 
    console.log("heelo");
    
    const { name, email, phoneNo, members,tourPackageId , price, title } = req.body;
    if (!name || !email || !phoneNo || !members || !tourPackageId || !price || !title) {
      throw new ApiError(400, "All fields are required for booking");
    }
  
    const newBooking = await Booking.create({
      tourPackageId:tourPackageId,
      name,
      email,
      phoneNo,
      members,
      price,
      title,
      date: new Date()
    });
    console.log("booking create",newBooking);

// const savedBooking=  newBooking.save();
if(!newBooking){
  throw new ApiError(400,"booking not saved")
}
const invoicePath = generateInvoice(newBooking);
console.log("invoicePath",invoicePath);

if(!invoicePath){
  throw new ApiError(400,"invoice not saved")
}
// Send success response
    res
      .status(201)
      .json(new Apiresponse(201, newBooking,{invoiceUrl: invoicePath}, " Booking successful"));
  
});

// Update a booking
const updateBooking =asyncHandler( async (req, res) => {

    const { id } = req.params;
    const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBooking) {
     throw new ApiError( 500, "Booking not found" );
    }
    res
    .status(200)
    .json(new Apiresponse(200,updateBooking,"booking updated"));
  
});

// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
