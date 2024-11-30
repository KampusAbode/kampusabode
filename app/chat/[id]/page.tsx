"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  sendMessageToKampusAbode,
  fetchMessagesWithKampusAbode,
} from "../../utils/api";

const UserChat = ({ userId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch messages for this user
  useEffect(() => {
    fetchMessagesWithKampusAbode(userId, (fetchedMessages) => {
      setMessages(fetchedMessages);
    });
  }, [userId]);

  // Send a message
  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      const res = await sendMessageToKampusAbode(userId, userId, message);
      toast.success(res.success);
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Chat with Kampus Abode</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "1rem",
        }}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender === userId ? "You" : "Kampus Abode"}:</strong>{" "}
            {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        style={{ width: "70%", marginRight: "1rem" }}
      />
      <button onClick={handleSendMessage} style={{ padding: "0.5rem 1rem" }}>
        Send
      </button>
    </div>
  );
};



export default UserChat;
