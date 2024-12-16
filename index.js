
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const cors = require("cors");
const app = require('./app');
dotenv.config();
dotenv.config({
  path: './env',
});



mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`DB connection successful!`);
  });

  const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

