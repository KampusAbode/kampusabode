"use client";

import React, { useState, useEffect } from "react";
import { getAllConversations } from "../utils/api";
import Link from "next/link";
import { format, isToday, isYesterday } from "date-fns";
import  './admin.css';

const AdminChat = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllConversations();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);


  return (
    <section className="admin-chat-page">
      <div className="container">
    
        <h3>Users Messages</h3>
        <p>Click on a user to view messages</p>
          <ul>
            {users === null ? (
              <p>Loading messages...</p>
            ) : users.length > 0 ? (
              users.map((msg, index) => {
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
                  <Link
                    href={`/adminchatroom/${msg.userName}/${msg.senderId}`}
                    key={index}
                    className="message">
                    <span className="username">{msg.userName}</span>
                    <p className="content"> {msg.content}</p>
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
