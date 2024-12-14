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
  currentUserRole: "admin" | "user";
};

const ChatComponent: React.FC<ChatProps> = ({
  currentUserId,
  receiverId,
  currentUserName,
  receiverName,
  currentUserRole,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.userdata);

  // Fetch messages
  useEffect(() => {
    if (!currentUserId || !receiverId) return;
    const userId = user?.id === currentUserId ? currentUserId : receiverId;

    const unsubscribe = listenToMessagesForConversation(
      userId,
      (fetchedMessages) => {
        // Ensure timestamps are properly formatted and sort messages
        const sortedMessages = fetchedMessages
          .map((msg) => ({
            ...msg,
            timestamp: msg.timestamp?.toDate
              ? msg.timestamp.toDate()
              : new Date(msg.timestamp),
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(sortedMessages);
      }
    );

    return () => unsubscribe();
  }, [currentUserId, receiverId]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendNotification = (currentUserName, message) => {
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notifications.");
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(`Message from ${currentUserName}`, {
          body: message,
          icon: "/LOGO/logo_O.png",
          tag: "message-notification", // Prevent duplicate notifications
        });
      } else {
        console.log("Notification permission denied.");
      }
    });
  };

  // Handle message send
  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    setIsLoading(true);

    const sender = {
      senderId: currentUserId,
      userName: currentUserName,
      role: currentUserRole,
    };

    try {
      const res = await sendMessage(sender, receiverId, message);

      if (res?.success) {
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
        toast.success("Message sent!");

        sendNotification(currentUserName, message);
        
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Message send error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle "Enter" key press to send the message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - timestamp.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInMinutes < 1) {
    return "Now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInHours < 2) {
    return `${diffInHours}h`; // e.g., "3h"
  } else if (isYesterday(timestamp)) {
    return "Yesterday";
  } else if (isToday(timestamp)) {
    return format(timestamp, "hh:mm a");
  } else {
    return format(timestamp, "dd-MM-yyyy");
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
              const formattedTime = formatTimestamp(msg.timestamp);

              return (
                <div
                  key={index}
                  className={`message-box ${
                    isSentByCurrentUser ? "right" : "left"
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
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChatComponent;
