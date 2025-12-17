"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);

export default function ChatPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const handleLoadMessages = (msgs) => setMessages(msgs);
  const handleNewMessage = (msg) => setMessages(prev => [...prev, msg]);

  socket.on("loadMessages", handleLoadMessages);
  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("loadMessages", handleLoadMessages);
    socket.off("newMessage", handleNewMessage);
  };
  },[]);   
  

  const sendMessage = () => {
    if (!message || !user.name) return;

    socket.emit("sendMessage", {
      sender: user.name,
      text: message,
    });

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg flex flex-col">
        <div className="p-4 border-b font-semibold">💬 Chat</div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-xs px-4 py-2 rounded-lg ${
                m.sender === user.name
                  ? "bg-black text-white ml-auto"
                  : "bg-gray-200"
              }`}
            >
              <p className="text-xs opacity-70">{m.sender}</p>
              <p>{m.text}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input
            className="flex-1 border rounded-lg px-3 py-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
