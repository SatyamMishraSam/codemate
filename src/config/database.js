const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://codingsatyam:IjeoNaNwVXRNA4Zw@codemate.1id3p.mongodb.net/CodeMate"
  );
};

module.exports = connectDB;
