const express = require("express");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // validate our req data
    validateSignupData(req);
    const { firstName, lastName, email, password, age, skills } = req.body;
    // Hash our password before saving to DB

    const hashedPassword = await bcrypt.hash(password, 10);

    // create an instance of user
    const user = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      skills,
    });
    await user.save();
    res.send("User added Successfully");
  } catch (e) {
    res.send("Error creating user" + e.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // email validation check
    if (!validator.isEmail(email)) {
      throw new Error("Please Enter Valid Email");
    }

    // fetch the user model so that we will get the user details like password and later we can compare
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    // hashed Password dcryption
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      // Password matched , now create a token and pass it to cookies

      const token = jwt.sign({ _id: user._id }, "thisisMySecretKey", {
        expiresIn: "1d",
      });

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 3600000),
      });

      res.send("Login Successfull");
    } else {
      throw new Error("Password doesn't match !!");
    }
  } catch (e) {
    res.status(400).send("Something Went Wrong !!" + e.message);
  }
});

// for logout we dont need userAuth Router and direct assign token to null and expire the cookie to now
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("user logged out successfully");
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

module.exports = authRouter;
