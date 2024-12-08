"use client";

import React, { useState, useEffect } from "react";
// import { getAllConversations, getMessagesForConversation, sendMessage } from "../utils/api";
import { getAllConversations } from "../utils/api";
import Link from "next/link";
import { format } from "date-fns";

const AdminChat = () => {
  // const [selectedUser, setSelectedUser] = useState(null); // Selected user ID
  // const [message, setMessage] = useState(""); // Current message input
  // const [messages, setMessages] = useState([]); // Messages for selected user
  const [users, setUsers] = useState([]); // Users list with messages

  // Fetch all users with messages
  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getAllConversations();
      setUsers(fetchedUsers);

    };
    fetchUsers();
  }, []);


  return (
    <section className="admin-chat-page">
      <div className="container">
        {/* Left Sidebar: Users List */}
        <div>
          <h3>Users Messages</h3>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "2rem" }}>
            {users.length > 0 ? (
              users.map((msg, index) => {
                const timestamp = msg.timestamp?.toDate
                  ? msg.timestamp.toDate()
                  : new Date();
                const formattedTime = format(timestamp, "hh:mm a");

                return (
                  <div
                    key={index}
                    style={{
                      marginBottom: "1.5rem",
                      textAlign:
                        msg.senderId === "Kampusabode" ? "right" : "left",
                    }}>
                    <Link
                      style={{
                        display: "inline-block",
                        padding: "1rem",
                        borderRadius: "1px",
                        backgroundColor:
                          msg.senderId === "Kampusabode"
                            ? "#d1e7dd"
                            : "#f8d7da",
                        color: "#000",
                      }}
                      href={`/adminchatroom/${msg.senderId}`}>
                      <strong>{msg.userName}:</strong> {msg.content}
                      <span>{formattedTime}</span>
                    </Link>
                  </div>
                );
              })
            ) : (
              <p>No messages yet.</p>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AdminChat;
