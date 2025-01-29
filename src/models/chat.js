const { default: mongoose } = require("mongoose");

// Nested schema for the only msgs
const msgSchema = new mongoose.Schema(
  {
    senderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// our main chat schema which has participants details and msgs  and seperate schema (nested)
const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", rquired: true },
  ],

  msgs: [msgSchema],
});

module.exports = mongoose.model("Chat", chatSchema);
