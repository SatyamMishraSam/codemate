const Chat = require("../models/chat");
const ConnectionModel = require("../models/connection");

const initializeSocket = (server) => {
  const socket = require("socket.io");

  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // handle events

    // we have action emitted from frontend client  now we need to create a room with 2 ppls as fromuserId and targetUserId
    // seperate room for individual ppls and , targetUserId and loggedInUser we will get from client emit actions and this room will be created when i am loading my page

    socket.on(
      "joinChat",
      ({ loggedInUser, targetUserId, firstName, lastName }) => {
        const roomId = [loggedInUser, targetUserId].sort().join("_"); //creating a unique room bw users
        console.log(firstName + " has joined this room : " + roomId);
        socket.join(roomId);
      }
    );

    socket.on(
      "sendMsg",
      async ({ loggedInUser, targetUserId, firstName, text, lastName }) => {
        try {
          const roomId = [loggedInUser, targetUserId].sort().join("_"); //creating a unique room bw users

          // backend has to send msg to room so we are creating roomId again
          // so io.to will send the msg to room and then with emit method it can be send to others
          // console.log(firstName + " " + text);

          //   this is for saving chats in our DB

          const existingConnectionRequest = await ConnectionModel.findOne({
            $or: [
              // This checks whether there is already connection send to the toUser
              {
                fromUserId: loggedInUser,
                toUserId: toUserId,
                status: "accepted",
              },
              // This checks wherther the toUserId has sent req to fromUserId(reverse)
              {
                fromUserId: toUserId,
                toUserId: fromUserId,
                status: "accepted",
              },
            ],
          });
          if (!existingConnectionRequest) return;

          let chat = await Chat.findOne({
            participants: { $all: [loggedInUser, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [loggedInUser, targetUserId],
              msgs: [],
            });
          }

          chat.msgs.push({ senderUserId: loggedInUser, text });
          await chat.save();
          // this msgReceived , now we have to listen into client so that we can display the data or text
          io.to(roomId).emit("msgReceived", { firstName, text, lastName });
        } catch (e) {
          console.log(e);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
