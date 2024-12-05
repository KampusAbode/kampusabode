"use client";

import React, { useState, useEffect } from "react";
// import { getAllConversations, getMessagesForConversation, sendMessage } from "../utils/api";
import { getAllConversations, sendMessage } from "../utils/api";
import Link from "next/link";

const AdminChat = () => {
  const [selectedUser, setSelectedUser] = useState(null); // Selected user ID
  const [message, setMessage] = useState(""); // Current message input
  // const [messages, setMessages] = useState([]); // Messages for selected user
  const [users, setUsers] = useState([]); // Users list with messages

  // Fetch all users with messages
  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getAllConversations();
      setUsers(fetchedUsers);

      console.log(fetchedUsers);
    };
    fetchUsers();
  }, []);

  

  // Fetch messages for the selected user
  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     if (selectedUser) {
  //       const fetchedMessages = await getMessagesForConversation(
  //         conversationId
  //       );
  //       setMessages(fetchedMessages);
  //     }
  //   };
  //   fetchMessages();
  // }, [selectedUser]);

  // Send a message to the selected user
  // const handleSendMessage = () => {
  //   if (message.trim() !== "" && selectedUser) {
  //     sendMessage(senderId, receiverId, message, true);
  //     setMessage(""); // Clear the input field
  //   }
  // };

  return (
    <section className="admin-chat-page">
      <div className="container">
        {/* Left Sidebar: Users List */}
        <div>
          <h3>Users Message</h3>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "2rem" }}>
            {users.length > 0 ? (
              users.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "1rem",
                    textAlign:
                      msg.senderId === "Kampusabode" ? "right" : "left",
                  }}>
                  <Link
                    style={{
                      display: "inline-block",
                      padding: "0.5rem 1rem",
                      borderRadius: "10px",
                      backgroundColor:
                        msg.senderId === "Kampusabode" ? "#d1e7dd" : "#f8d7da",
                      color: "#000",
                    }}
                    href={`/adminchatroom/${msg.senderId}`}
                    >
                    <strong>
                      {msg.userName}:
                    </strong>{" "}
                    {msg.content}
                  </Link>
                </div>
              ))
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
