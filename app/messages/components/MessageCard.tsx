"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import "./messagecard.css";
import Link from "next/link";

type Conversation = {
  id: string;
  userName: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: any; // This can be a Firestore timestamp or Date
  read?: boolean;
};

interface MessageCardProps {
    conversation: Conversation;
    userId: string
}

// Custom helper function to get relative time
const getRelativeTime = (timestamp: any): string => {
  // Convert Firestore timestamp to JS Date if needed
  const date =
    timestamp && typeof timestamp.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp);

  const diffInMs = Date.now() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "1m ago";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return "1 day ago";
  } else {
    return `${diffInDays} days ago`;
  }
};

const MessageCard: React.FC<MessageCardProps> = ({ conversation, userId }) => {
  const { userName, content, timestamp, read } = conversation;
  const formattedTime = timestamp ? getRelativeTime(timestamp) : "";


  return (
      <div className={`message-card ${read ? "read" : "unread"}`}>
        <div className="message-header">
          <span className="sender-name">{userName}</span>
          <span className="timestamp">{formattedTime}</span>
        </div>
        <span className="message-content">{content}</span>
      </div>
  );
};

export default MessageCard;
