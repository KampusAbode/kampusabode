"use client";

import React from "react";
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInYears,
} from "date-fns";
import "./messagecard.css";
import Link from "next/link";

type Conversation = {
  id: string;
  userName: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: any; 
  read?: boolean;
};

interface MessageCardProps {
    conversation: Conversation;
    userId: string
}

// Custom helper function to get relative time
 const formatTimestamp = (timestamp: any): string => {
   const now = new Date();
   const date =
     timestamp && typeof timestamp.toDate === "function"
       ? timestamp.toDate()
       : new Date(timestamp);

   const minutesDiff = differenceInMinutes(now, date);
   const hoursDiff = differenceInHours(now, date);
   const daysDiff = differenceInDays(now, date);

   if (minutesDiff < 1) return "Just now";
   if (minutesDiff < 60) return `${minutesDiff}m`;
   if (hoursDiff < 24 && isToday(date)) return `${hoursDiff}h`;
   if (isYesterday(date)) return `Yesterday at ${format(date, "h:mm a")}`;
   if (isThisWeek(date))
     return `${format(date, "EEEE")} at ${format(date, "h:mm a")}`;
   if (isThisYear(date)) return format(date, "MMM d");
   return format(date, "MMM d, yyyy");
 };

const MessageCard: React.FC<MessageCardProps> = ({ conversation, userId }) => {
  const { userName, content, timestamp, read } = conversation;
  const formattedTime = timestamp ? formatTimestamp(timestamp) : "";


  return (
      <div className={`message-card ${read ? "read" : "unread"}`}>
        <div className="message-header">
          <h6 className="sender-name">{userName}</h6>
          <span className="timestamp">{formattedTime}</span>
        </div>
        <span className="message-content">{content}</span>
      </div>
  );
};

export default MessageCard;
