"use client";

import React, { useState, useEffect, useRef } from "react";

import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import toast from "react-hot-toast";
import { isToday, isYesterday, format } from "date-fns";
import {
  sendMessage,
  listenToMessagesForConversation,
} from "../../../utils/api";
import "./chat.css";

type ChatProps = {
  currentUserId: string;
  receiverId: string;
  currentUserName: string;
  receiverName: string;
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

  const user = useSelector((state: RootState) => state.userdata);

  // Fetch messages
  useEffect(() => {
    // Set up the listener
    const userId = user?.id === currentUserId ? currentUserId : receiverId;
    const unsubscribe = listenToMessagesForConversation(
      userId,
      (fetchedMessages) => {
        // Sort messages by timestamp in ascending order
        const sortedMessages = fetchedMessages.sort((a, b) => {
          const timestampA = a.timestamp?.toDate
            ? a.timestamp.toDate()
            : new Date(a.timestamp);
          const timestampB = b.timestamp?.toDate
            ? b.timestamp.toDate()
            : new Date(b.timestamp);
          return timestampA - timestampB; // Ascending order
        });
        setMessages(sortedMessages);
      }
    );

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [receiverId]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // Handle message send
  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    try {
      const sender = { senderId: currentUserId, userName: currentUserName };
      let res = await sendMessage(sender, receiverId, message);

      currentUserId === "kampusabode2384719744"
        ? (res = await sendMessage(sender, receiverId, message, true))
        : (res = await sendMessage(sender, receiverId, message));

      if (res.success) {
        toast.success("Message sent!");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            senderId: currentUserId,
            content: message,
            status: "sent",
            timestamp: new Date(),
          },
        ]);
        setMessage("");
        inputRef.current?.focus();
      } else {
        toast.error("Failed to send message. Try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  // Handle search on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <section className="chat-page">
      <div className="container">
        <div className="chat-header">
          <h4>{receiverName}</h4>
        </div>

        <div className="chat-display">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const isSentByCurrentUser = msg.senderId === currentUserId;
              const timestamp = msg.timestamp?.toDate
                ? msg.timestamp.toDate()
                : new Date();

              const formattedTime = (() => {
                if (isToday(timestamp)) {
                  return format(timestamp, "hh:mm a");
                } else if (isYesterday(timestamp)) {
                  return "Yesterday";
                } else {
                  return format(timestamp, "dd-MM-yyyy");
                }
              })();

              return (
                <div
                  key={index}
                  className={`message-box ${
                    isSentByCurrentUser ? "right" : ""
                  }`}>
                  <div className="message-detail">
                    {isSentByCurrentUser ? (
                      <>
                      <span></span>
                      <span>{formattedTime}</span>
                      
                      </>
                    ) : (
                      <>
                      <span>{formattedTime}</span>
                      <span></span>
                      
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
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            ref={inputRef}
          />
          <button
            className="btn"
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
