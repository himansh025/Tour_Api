const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tourPackageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  members: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
