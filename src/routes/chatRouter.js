const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");

const chatRouter = express.Router();

// api to get the chat
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const loggedInUser = req.user._id;

  try {

    



    let chat = await Chat.findOne({
      participants: { $all: [loggedInUser, targetUserId] },
    }).populate({
      path: "msgs.senderUserId", //path is go to msgs in schmea and then senderUserId
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [loggedInUser, targetUserId],
        msgs: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (e) {
    console.log(e);
  }
});

module.exports = chatRouter;
