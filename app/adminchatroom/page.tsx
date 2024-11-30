"use client";

import React, { useState, useEffect } from "react";
import {
  fetchUsersWithMessages,
  fetchMessagesWithKampusAbode,
  sendMessageToKampusAbode,
} from "../utils/api";

const AdminChat = () => {
  const [selectedUser, setSelectedUser] = useState(null); // Selected user ID
  const [message, setMessage] = useState(""); // Current message input
  const [messages, setMessages] = useState([]); // Messages for selected user
  const [users, setUsers] = useState([]); // Users list with messages

  // Fetch all users with messages
  useEffect(() => {
    fetchUsersWithMessages("kampusabode").then((fetchedUsers) => {
      setUsers(fetchedUsers);
    });
  }, []);

  // Fetch messages for the selected user
  useEffect(() => {
    if (selectedUser) {
      fetchMessagesWithKampusAbode(selectedUser, (fetchedMessages) => {
        setMessages(fetchedMessages);
      });
    }
  }, [selectedUser]);

  // Send a message to the selected user
  const handleSendMessage = () => {
    if (message.trim() !== "" && selectedUser) {
      sendMessageToKampusAbode(selectedUser, message);
      setMessage(""); // Clear the input field
    }
  };

  return (
    <section className="admin-chat-page">
      <div className="container" style={{ padding: "1rem", display: "flex" }}>
        {/* Left Sidebar: Users List */}
        <div
          style={{
            width: "25%",
            borderRight: "1px solid #ccc",
            padding: "1rem",
          }}>
          <h3>Users</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {users.map((user) => (
              <li
                key={user}
                style={{
                  cursor: "pointer",
                  padding: "0.5rem",
                  backgroundColor:
                    selectedUser === user ? "#e0e0e0" : "transparent",
                  borderRadius: "5px",
                }}
                onClick={() => setSelectedUser(user)}>
                {user}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Chat Area */}
        <div style={{ width: "75%", padding: "1rem" }}>
          {selectedUser ? (
            <>
              <h3>Chat with {selectedUser}</h3>
              {/* Chat Messages */}
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "1rem",
                  height: "400px",
                  overflowY: "auto",
                  marginBottom: "1rem",
                  backgroundColor: "#f9f9f9",
                }}>
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "1rem",
                        textAlign:
                          msg.sender === "kampusabode" ? "right" : "left",
                      }}>
                      <p
                        style={{
                          display: "inline-block",
                          padding: "0.5rem 1rem",
                          borderRadius: "10px",
                          backgroundColor:
                            msg.sender === "kampusabode"
                              ? "#d1e7dd"
                              : "#f8d7da",
                          color: "#000",
                        }}>
                        <strong>
                          {msg.sender === "kampusabode" ? "You" : selectedUser}:
                        </strong>{" "}
                        {msg.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No messages yet.</p>
                )}
              </div>

              {/* Input Field for Sending Messages */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                  }}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <p>Please select a user to start chatting.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminChat;
