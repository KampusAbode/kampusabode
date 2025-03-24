"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import Link from "next/link";
import "./messages.css";
import { getAllMessages } from "../utils"; // adjust the path as needed
import MessageCard from "./components/MessageCard"; // a component to render a single conversation
import fakeMessages from "./components/constants";

const Messages = () => {
  const user = useSelector((state: RootState) => state.user);
  const [conversations, setConversations] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Subscribe to all conversations related to the authenticated user
  // useEffect(() => {
  //   if (!user) return;
  //   const unsubscribe = getAllMessages((allConversations) => {
  //     // Filter conversations based on the user's ID (assumes each conversation includes senderId/receiverId)
  //     const userConversations = allConversations.filter(
  //       (convo) => convo.senderId === user.id || convo.receiverId === user.id
  //     );
  //     setConversations(userConversations);
  //   });
  //   return () => unsubscribe();
  // }, [user]);
  useEffect(() => {
    setConversations(fakeMessages);
  }, [user]);

  // Filter conversations based on selected filter
  const filteredConversations = conversations.filter((convo) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "read") return convo.read === true; // adjust property as needed
    if (selectedFilter === "unread") return convo.read !== true; // adjust property as needed
  });

  return (
    <section className="messages-page">
      <div className="container">
        <h2 className="page-heading">Messages</h2>
        {user ? (
          <>
            <div className="filter-messages">
              {["all", "read", "unread"].map((filter) => (
                <span
                  key={filter}
                  className={filter === selectedFilter ? "active" : ""}
                  onClick={() => setSelectedFilter(filter)}>
                  {filter}
                </span>
              ))}
            </div>
            <div className="messages-list">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((convo) => (
                  <MessageCard
                    key={convo.id}
                    conversation={convo}
                    userId={user.id}
                  />
                ))
              ) : (
                <p style={{ textAlign: "center" }}>No messages available.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <p>You must log in to view messages.</p>
            <Link href="/auth/login" className="btn">
              Log in
            </Link>
          </>
        )}
      </div>
    </section>
  );
};

export default Messages;
