const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        messsage: `{VALUE} is not Supported`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexing for the optmization of search query
// As everytime we search with fromUseriId and toUserid so we have performed indexing there
connectionSchema.index({ fromUserId: 1, toUserId: 1 });

// this is known as schema methods which will be called before saving the document
// we have to call to next() also for executing the next lines

// This code specially checks user should not send connection to itself
// connectionSchema.pre("save", function () {
//   const connectionRequest = this;
//   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//     throw new Error("Can't send connection to yourself");
//   }

//   next();
// });

const ConnectionModel = new mongoose.model("ConnectionModel", connectionSchema);
module.exports = ConnectionModel;
