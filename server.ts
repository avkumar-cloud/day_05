import "dotenv/config";
import { getRoomId } from "./src/lib/room.js";
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import mongoose from "mongoose";
import Message from "./src/models/Message.js";

const app = next({ dev: true });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => handler(req, res));

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  mongoose.connect(process.env.MONGODB_URI!);

  io.on("connection", (socket) => {

  socket.on("joinRoom", async ({ senderId, receiverId }) => {
    const roomId = getRoomId(senderId, receiverId);
    socket.join(roomId);

    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 });

    socket.emit("loadMessages", messages);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    const roomId = getRoomId(senderId, receiverId);

    const msg = await Message.create({
      sender: senderId,
      receiver: receiverId,
      roomId,
      text
    });

    io.to(roomId).emit("newMessage", msg);
  });

});


  server.listen(3000, () =>
    console.log("Server running on http://localhost:3000")
  );
});
