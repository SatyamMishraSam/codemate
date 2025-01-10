const express = require("express");
const { userAuth } = require("../middlewares/auth");
const UserModel = require("../models/user");
const ConnectionModel = require("../models/connection");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.send(user.firstName + "has sent request");
});

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;
      const status = req.params.status;

      const { firstName } = await UserModel.findById(toUserId);

      // Status should be only ignored and interested
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.send("Invalid Status Type");
      }

      // User should not send request to itself
      if (fromUserId.equals(toUserId)) {
        throw new Error("Can't send connection to yourselfff");
      }

      // toUserId should also be valid so validation for that, we should check it in the user model

      const toUserValid = await UserModel.findById(toUserId);
      if (!toUserValid) {
        res.status(400).send("Not a valid User Id exist in our DB");
      }

      // check if request is sent already or not
      // user should not send the reuqest to itself

      const existingConnectionRequest = await ConnectionModel.findOne({
        $or: [
          // This checks whether there is already connection send to the toUser
          { fromUserId: fromUserId, toUserId: toUserId },
          // This checks wherther the toUserId has sent req to fromUserId(reverse)
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).send("Connection Already Exists!!");
      }

      const connectionRequestModel = new ConnectionModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequestModel.save();
      res.json({
        message: `${req.user.firstName} has ${status} to ${firstName}'s profile`,
        data: data,
      });
    } catch (e) {
      res.status(400).send("Something went wrong :" + e.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    // validate the status =>accepted, rejected
    // A sent request to B
    // B should be loggedin user => loggedInUser=toUserId
    // only status with interested
    // requestId should be valid

    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.send("Status is not Allowed");
      }

      const connectionRequest = await ConnectionModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.send("Connection Not found");
      }

      // Now i will change the status of that request
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Connection Request " + status, data });
    } catch (e) {
      res.send(e.message);
    }
  }
);

module.exports = requestRouter;
