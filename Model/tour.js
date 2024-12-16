const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  images: [{
     type: String,
     required:true 
    }],
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
    date: {
    type: Date,
    required:true
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a positive number"],
  },
  duration: {
    type: String,
    required: [true, "Duration is required"]
  },
  locations: {
    type: [String],
    required: [true, "At least one location is required"],
  },
}, {
  timestamps: true,
});

const Tour = mongoose.models.Tour || mongoose.model("Tour", tourSchema);
module.exports= Tour;