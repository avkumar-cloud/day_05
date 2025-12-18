"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
};

type Props = {
  socket: any; // Socket.IO client instance
  messages: Message[];
  selectedUser: { _id: string; name: string };
  currentUserId: string;
};

export default function PrivateChat({
  socket,
  messages,
  selectedUser,
  currentUserId
}: Props) {
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !selectedUser) return;

    socket.emit("sendMessage", {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      text
    });

    setText("");
  };

  return (
    <main className="flex-1 flex flex-col h-full border-l">
      {/* Header */}
      <div className="border-b p-4 font-semibold">{selectedUser.name}</div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`flex ${
              m.sender === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`px-3 py-2 rounded ${
                m.sender === currentUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </main>
  );
}
