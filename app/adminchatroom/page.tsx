"use client";

import React, { useState, useEffect } from "react";
import { getAllMessages } from "../utils";
import Link from "next/link";
import { format, isToday, isYesterday } from "date-fns";
import "./admin.css";
import Loader from "../components/loader/Loader";

const formatTimestamp = (timestamp: any): string => {
  // Try to convert the timestamp to a Date instance
  const date =
    timestamp && typeof timestamp.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  if (isToday(date)) {
    return format(date, "hh:mm a");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "dd-MM-yyyy");
  }
};



const AdminChat = () => {
  const [users, setUsers] = useState<any[] | null>(null);

  useEffect(() => {
    const unsubscribe = getAllMessages((fetchedMessages) => {
      // Sort messages by timestamp in ascending order
      const sortedMessages = fetchedMessages.sort((a, b) => {
        const timestampA =
          a.timestamp && typeof a.timestamp.toDate === "function"
            ? a.timestamp.toDate()
            : new Date(a.timestamp);
        const timestampB =
          b.timestamp && typeof b.timestamp.toDate === "function"
            ? b.timestamp.toDate()
            : new Date(b.timestamp);
        return timestampA.getTime() - timestampB.getTime();
      });
      setUsers(sortedMessages);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <section className="admin-chat-page">
      <div className="container">
        <h3 className="page-heading">Users Messages</h3>
        <p>Click on a user to view messages</p>
        <ul>
          {users === null ? (
            <Loader/>
          ) : users.length > 0 ? (
            users.map((msg, index) => {
              const formattedTime = formatTimestamp(msg.timestamp);

              return (
                <Link
                  href={`/adminchatroom/${msg.userName}/${msg.senderId}`}
                  key={index}
                  className="message">
                  <span className="username">{msg.userName}</span>
                  <p className="content">{msg.content}</p>
                  <span className="timestamp">{formattedTime}</span>
                </Link>
              );
            })
          ) : (
            <p>No messages yet.</p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default AdminChat;
