"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import Link from "next/link";
import "./messages.css";
import { getMessagesForUser, deleteMessageFromFirebase } from "../utils";
import MessageCard from "./components/MessageCard";
// import fakeMessages from "./components/constants";
import Prompt from "../components/prompt/Prompt";

const Messages = () => {
  const user = useSelector((state: RootState) => state.user);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [longPressedMessage, setLongPressedMessage] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // For demo purposes we're using fakeMessages.
  // If using Firebase, uncomment the following useEffect and comment out the fakeMessages one.

  useEffect(() => {
    if (!user) return;
    const unsubscribe = getMessagesForUser(user.id, (allConversations) => {
      const userConversations = allConversations.filter(
        (convo) => convo.receiverId === user.id
      );

      setConversations(userConversations);

      console.log(user);
    });
    return () => unsubscribe();
  }, [user]);

  // useEffect(() => {
  //   setConversations(fakeMessages);
  // }, [user]);

  // Filter conversations based on selected filter
  const filteredConversations = conversations.filter((convo) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "read") return convo.read === true;
    if (selectedFilter === "unread") return convo.read !== true;
    return true;
  });

  const handleLongPress = (convo: any, e: React.MouseEvent) => {
    e.preventDefault(); // prevent context menu
    // Allow deletion only if the current user is the sender, or if desired, add additional admin checks
    if (convo.senderId === user.id) {
      setLongPressedMessage(convo);
      setShowDeleteDialog(true);
    }
  };

  const confirmDeleteMessage = async () => {
    if (!longPressedMessage) return;
    try {
      await deleteMessageFromFirebase(user.id, longPressedMessage.id);
      setConversations((prev) =>
        prev.filter((convo) => convo.id !== longPressedMessage.id)
      );
      // Optionally, show a toast or notification for successful deletion
    } catch (error) {
      console.error("Error deleting message:", error);
      // Optionally, show an error toast
    } finally {
      setShowDeleteDialog(false);
      setLongPressedMessage(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setLongPressedMessage(null);
  };

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
                  // Wrap MessageCard with a div to listen for long press (right-click)
                  <div
                    key={convo.id}
                    onContextMenu={(e) => handleLongPress(convo, e)}>
                    <MessageCard conversation={convo} userId={user.id} />
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center" }}>
                  No {selectedFilter === "all" ? "" : selectedFilter} messages
                  available.
                </p>
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

      {/* Reusable Prompt component for delete confirmation */}
      <Prompt
        message="Are you sure you want to delete this message?"
        isOpen={showDeleteDialog}
        onConfirm={confirmDeleteMessage}
        onCancel={cancelDelete}
      />
    </section>
  );
};

export default Messages;
