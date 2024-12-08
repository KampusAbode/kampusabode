"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { getMessagesForConversation, sendMessage } from "../../../utils/api";
import "./chat.css";

type ChatProps = {
  currentUserId: string; // ID of the current user (e.g., admin or student)
  receiverId: string; // ID of the chat receiver
  currentUserName: string; // Name of the current user
  receiverName: string; // Name of the receiver (admin or user)
};

const ChatComponent: React.FC<ChatProps> = ({
  currentUserId,
  receiverId,
  currentUserName,
  receiverName,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const fetchedMessages = await getMessagesForConversation(receiverId);
        setMessages(fetchedMessages || []);
      } catch (error) {
        toast.error("Failed to load messages.");
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

  // Handle message send
  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    setIsLoading(true);
    try {
      const sender = { senderId: currentUserId, userName: currentUserName };
      const res = await sendMessage(sender, receiverId, message);

      if (res.success) {
        toast.success("Message sent!");
        setMessages((prevMessages) => [
          ...prevMessages,
          { senderId: currentUserId, content: message, timestamp: new Date() },
        ]);
        setMessage("");
        inputRef.current?.focus();
      } else {
        toast.error("Failed to send message. Try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="chat-page">
      <div className="container">
        <div className="chat-header">
          <h2>Chat with {receiverName}</h2>
        </div>

        <div className="chat-display">
          {isLoading ? (
            <p className="loading-text">Loading messages...</p>
          ) : messages.length > 0 ? (
            messages.map((msg, index) => {
              const isSentByCurrentUser = msg.senderId === currentUserId;
              const timestamp = msg.timestamp?.toDate
                ? msg.timestamp.toDate()
                : new Date();
              const formattedTime = format(timestamp, "hh:mm a");

              return (
                <div
                  key={index}
                  className={`message-box ${
                    isSentByCurrentUser ? "right" : ""
                  }`}>
                  <div className="message-detail">
                    {isSentByCurrentUser ? (
                      <>
                        <span>{formattedTime}</span>
                        <span>YOU</span>
                      </>
                    ) : (
                      <>
                        <span>{receiverName}</span>
                        <span>{formattedTime}</span>
                      </>
                    )}
                  </div>
                  <div className="message-content">{msg.content}</div>
                </div>
              );
            })
          ) : (
            <p className="no-messages">No messages yet. Say hello!</p>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            ref={inputRef}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || message.trim() === ""}>
            Send
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChatComponent;
