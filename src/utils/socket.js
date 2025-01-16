const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    //handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " Joined   " + roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        const roomId = getSecretRoomId(userId, targetUserId);
        console.log(firstName, ":", text);
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }
        chat.messages.push({ senderId: userId, text });
        await chat.save();
        io.to(roomId).emit("messageReceived", { firstName, lastName, text });
      }
    );
    socket.on("disconnected", () => {});
  });
};
module.exports = initializeSocket;
