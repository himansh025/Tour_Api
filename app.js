const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const path = require('path');
const bodyParser = require("body-parser");

const allowedOrigins = [
    'http://localhost:5173', 
    '',
  ];
  
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

  // app.options('*', cors());  // 
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json());



const bookingRoutes = require('./routes/bookingRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const userRoutes = require('./routes/userRoute.js');


app.use('/api/v1/user', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/admin', adminRoutes);


module.exports = app;
