const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionModel = require("../models/connection");
const UserModel = require("../models/user");

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age gender skills photoURL about";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
      // }).populate("fromUserId",["firstName", "lastName"]);
    }).populate(
      "fromUserId",
      "firstName lastName age gender skills photoURL about"
    );

    res.json({ message: "Data Fetched Successfully", data: connectionRequest });
  } catch (e) {
    res.send(e.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (e) {
    res.send(e.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // user should see the cards except
    // his own card
    // his connections card
    // ignored people
    // already send the connection request

    const loggedInUser = req.user;
    // find all connection req (send + received)

    const connectionRequest = await ConnectionModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    //   Satyam ->virat
    // so satyam and virat should not see profiles on the feed of each other

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    // console.log(hideUsersFromFeed);

    const userFeed = await UserModel.find({
      $and: [
        // hide the users who has the connectiona and request
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        // user should not see iteself in the feed
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA);

    res.send(userFeed);
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = userRouter;
