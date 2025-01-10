const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          console.log(value);
          throw new Error("Not a valid email : " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Not a Strong Password : " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },

    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Not Valid Gender");
        }
      },
    },
    photoURL: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCpY5LtQ47cqncKMYWucFP41NtJvXU06-tnQ&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Not a valid Photo URL : " + value);
        }
      },
    },

    about: {
      type: String,
      default: "This is default about of user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
// perfoming indexing on email
// userSchema.index({ email: 1 });

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
