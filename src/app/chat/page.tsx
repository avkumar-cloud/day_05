"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import PrivateChat from "@/components/PrivateChat";

type User = {
  _id: string;
  name: string;
  email?: string;
};

type Message = {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
};

export default function ChatPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize Socket.IO
  useEffect(() => {
    const s = io(); // connect to server
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Load users/contacts from API
  useEffect(() => {
    if (!user?.id) return;

    fetch("/api/users")
      .then((res) => res.json())
      .then((data: User[]) => {
        // remove logged-in user from contacts
        setContacts(data.filter((u) => u._id !== user.id));
      });
  }, [user]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleLoadMessages = (msgs: Message[]) => setMessages(msgs);
    const handleNewMessage = (msg: Message) =>
      setMessages((prev) => [...prev, msg]);

    socket.on("loadMessages", handleLoadMessages);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("loadMessages", handleLoadMessages);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]);

  // Open private chat
  const openChat = (contact: User) => {
    if (!socket || !user) return;

    setSelectedUser(contact);
    setMessages([]);

    socket.emit("joinRoom", {
      senderId: user.id,
      receiverId: contact._id
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        contacts={contacts}
        selectedUser={selectedUser}
        onSelect={openChat}
      />

      {/* Private Chat */}
      {socket && selectedUser && (
        <PrivateChat
          socket={socket}
          messages={messages}
          selectedUser={selectedUser}
          currentUserId={user?.id}
        />
      )}

      {!selectedUser && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a contact to start chatting
        </div>
      )}
    </div>
  );
}
