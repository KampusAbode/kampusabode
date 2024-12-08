"use client";

import React, { useState, useEffect } from "react";
import { getAllConversations } from "../utils/api";
import Link from "next/link";
import { format } from "date-fns";

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

  const ADMIN_ID = "Kampusabode";

  return (
    <section className="admin-chat-page">
      <div className="container">
        <div>
          <h3>Users Messages</h3>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "2rem" }}>
            {users === null ? (
              <p>Loading messages...</p>
            ) : users.length > 0 ? (
              users.map((msg, index) => {
                const timestamp = msg.timestamp?.toDate
                  ? msg.timestamp.toDate()
                  : new Date();
                const formattedTime = format(timestamp, "hh:mm a");

                return (
                  <div
                    key={index}
                    className={`message ${
                      msg.senderId === ADMIN_ID ? "sender" : "receiver"
                    }`}>
                    <Link
                      href={`/adminchatroom/${msg.userName}/${msg.senderId}`}>
                      <a>
                        <div>
                          <strong>{msg.userName} : </strong> {msg.content}{" "}
                          <span>{formattedTime}</span>
                        </div>
                      </a>
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
