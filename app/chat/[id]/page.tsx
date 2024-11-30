"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  sendMessageToKampusAbode,
  fetchMessagesWithKampusAbode,
} from "../../utils/api";

type Params = {
  params: { id: string };
};

const Chat = ({ params }: Params) => {
  const userId = params.id;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null); // For managing focus on the input field
  const messagesEndRef = useRef(null); // To scroll to the latest message

  // Fetch messages for this user
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      const conversationId = `${userId}_kampusabode`;
      const fetchedMessages = await fetchMessagesWithKampusAbode(userId, conversationId);

      setMessages(fetchedMessages || []);
      setIsLoading(false);
    };

    fetchMessages();
  }, [userId]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      try {
        const res = await sendMessageToKampusAbode(userId, userId, message);
        if (res.success) {
          toast.success("Message sent!");
          setMessage(""); // Clear the input field
          inputRef.current?.focus(); // Focus back on the input
        } else {
          toast.error("Failed to send message. Try again.");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <section className="chat-page">
      <div
        className="container"
        style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Chat with Kampus Abode
        </h2>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            height: "300px",
            overflowY: "scroll",
            marginBottom: "1rem",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}>
          {isLoading ? (
            <p style={{ textAlign: "center" }}>Loading messages...</p>
          ) : messages.length > 0 ? (
            messages.map((msg, index) => (
              <p key={index} style={{ margin: "0.5rem 0" }}>
                <strong>
                  {msg.sender === userId ? "You" : "Kampus Abode"}:
                </strong>{" "}
                {msg.text}
              </p>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No messages yet. Say hello!</p>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            ref={inputRef}
            style={{
              flex: 1,
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginRight: "1rem",
            }}
            aria-label="Message Input"
          />
          <button
            onClick={handleSendMessage}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            disabled={isLoading || message.trim() === ""}
            aria-label="Send Message">
            Send
          </button>
        </div>
      </div>
    </section>
  );
};

export default Chat;
