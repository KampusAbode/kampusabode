import React, { useState, useEffect } from "react";
import {
  fetchUsersWithMessages,
  fetchMessagesWithKampusAbode,
  sendMessageToKampusAbode,
} from "../utils/api";

const AdminChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch all users with messages
    useEffect(() => {
      // Fetch the users with messages
      fetchUsersWithMessages("kampusabode").then((fetchedUsers) => {
        setUsers(fetchedUsers);
      });

      // No cleanup needed as fetchUsersWithMessages does not return a subscription
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
      sendMessageToKampusAbode(selectedUser, "KampusAbode", message); // sender is KampusAbode
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Kampus Abode Admin Chat</h1>
      <div style={{ display: "flex" }}>
        <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
          <h3>Users</h3>
          {users.map((user) => (
            <p
              key={user}
              style={{
                cursor: "pointer",
                textDecoration: selectedUser === user ? "underline" : "none",
              }}
              onClick={() => setSelectedUser(user)}>
              {user}
            </p>
          ))}
        </div>
        <div style={{ width: "70%", padding: "1rem" }}>
          {selectedUser ? (
            <>
              <h3>Chat with {selectedUser}</h3>
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  height: "300px",
                  overflowY: "scroll",
                  marginBottom: "1rem",
                }}>
                {messages.map((msg, index) => (
                  <p key={index}>
                    <strong>
                      {msg.sender === "KampusAbode" ? "You" : selectedUser}:
                    </strong>{" "}
                    {msg.text}
                  </p>
                ))}
              </div>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                style={{ width: "70%", marginRight: "1rem" }}
              />
              <button
                onClick={handleSendMessage}
                style={{ padding: "0.5rem 1rem" }}>
                Send
              </button>
            </>
          ) : (
            <p>Select a user to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
