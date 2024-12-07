"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  sendMessage,
  getMessagesForConversation,
  getAllConversations,
} from "../../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRouter } from "next/navigation";

type Params = {
  params: { id: string };
};

const Chat = ({ params }: Params) => {
  const receiverId = params.id;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // const router = useRouter();
  const user = useSelector((state: RootState) => state.userdata);

  // Fetch messages for this user
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const fetchedMessages = await getMessagesForConversation(receiverId);
        console.log(fetchedMessages);

        setMessages(fetchedMessages || []);
      } catch (error) {
        toast.error("Failed to load messages.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [receiverId]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  type Sender = {
    senderId: string;
    userName: string;
  };
  // Send a message
  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    setIsLoading(true);
    try {
      const sender: Sender = {
        senderId: "Kampusabode",
        userName: "Kampusabode",
      };

      const res = await sendMessage(sender, receiverId, message, true);

      if (res.success) {
        toast.success("Message sent!");
        setMessages((prevMessages) => [
          ...prevMessages,
          { senderId: "Kampusabode", content: message, timestamp: new Date() },
        ]);
        setMessage("");
        inputRef.current?.focus();
        setIsLoading(false);
      } else {
        toast.error("Failed to send message. Try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <section className="chat-page">
      <div className="container" style={{ padding: "1rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Chat with users
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
          ) : messages && messages.length > 0 ? (
            messages.map((msg, index) => (
              <p key={index} style={{ margin: "0.5rem 0" }}>
                <strong>
                  {msg.senderId === receiverId ? "Kampusabode" : "You"}:
                </strong>{" "}
                {msg.content}
              </p>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No messages yet. Say hello!</p>
          )}
          {/* <div ref={messagesEndRef} /> */}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            // ref={inputRef}
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
