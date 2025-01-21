const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DB_SECRET_CONN_STRING);
};

module.exports = connectDB;
