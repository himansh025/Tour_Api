const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');
const app = express();

// CORS configuration based on environment
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? process.env.ALLOWED_ORIGINS?.split(',') || [] // Production URL(s)
  : ['http://localhost:5173']; // Local development URL

console.log("Allowed Origins:", allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middleware for parsing incoming requests
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static files configuration
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use(cookieParser());

// Importing Routes
const bookingRoutes = require('./routes/bookingRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const userRoutes = require('./routes/userRoute.js');

// Defining Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/admin', adminRoutes);

module.exports = app;
