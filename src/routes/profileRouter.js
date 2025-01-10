const express = require("express");
const { userAuth } = require("../middlewares/auth");
const UserModel = require("../models/user");
const {
  validateSignupData,
  validateEditProfile,
} = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (e) {
    throw new Error("Something went wrong : " + e.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    loggedInUser.firstName = req.body.firstName;
    loggedInUser.lastName = req.body.lastName;
    loggedInUser.age = req.body.age;
    loggedInUser.gender = req.body.gender;
    loggedInUser.skills = req.body.skills;
    loggedInUser.about = req.body.about;
    loggedInUser.photoURL = req.body.photoURL;

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (e) {
    res.status(400).send("Something went wrong: " + e.message);
  }
});

module.exports = profileRouter;
