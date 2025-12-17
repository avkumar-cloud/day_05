import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import mongoose from "mongoose";
import Message from "@/models/Message";

const app = next({ dev: true });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => handler(req, res));

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  mongoose.connect(process.env.MONGODB_URI!);

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("sendMessage", async (data) => {
      const msg = await Message.create(data);
      io.emit("newMessage", msg);
    });
  });

  server.listen(3000, () =>
    console.log("Server running on http://localhost:3000")
  );
});
