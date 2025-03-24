"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import "./messageCard.css";
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

const MessageCard: React.FC<MessageCardProps> = ({ conversation, userId }) => {
  const { userName, content, timestamp, read } = conversation;

  // Format the timestamp to a relative time (e.g., "3 minutes ago")
  const formattedTime = timestamp
    ? formatDistanceToNow(
        timestamp.toDate ? timestamp.toDate() : new Date(timestamp),
        { addSuffix: true }
      )
    : "";

  return (
    <Link href={`/chat/${userId}/${userName}`}>
      <div className={`message-card ${read ? "read" : "unread"}`}>
        <div className="message-header">
          <span className="sender-name">{userName}</span>
          <span className="timestamp">{formattedTime}</span>
        </div>
        <span className="message-content">{content}</span>
      </div>
    </Link>
  );
};

export default MessageCard;
