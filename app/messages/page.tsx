"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "../store/userStore";
import { getMessagesForUser, deleteMessageFromFirebase } from "../utils";
import MessageCard from "./components/MessageCard";
import Prompt from "../components/modals/prompt/Prompt";
import "./messages.css";

interface Message {
  id: string;
  userName: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  timestamp: number;
}

const Messages = () => {
  const { user } = useUserStore((state) => state);
  const [conversations, setConversations] = useState<Message[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [longPressedMessage, setLongPressedMessage] = useState<Message | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);


  if (!user) {
    return (
      <section className="messages-page">
        <div className="container">
          <h4 className="page-heading">Messages</h4>

          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <p>Please log in to access your messages.</p>
            <Link href="/auth/login" style={{textDecoration: "underline"}}>Log in</Link>
          </div>
        </div>
      </section>
    );
  }

  useEffect(() => {
    const unsubscribe = getMessagesForUser(user.id, (allConvos: any[]) => {
      const userConvos = allConvos.filter(
        (c: Message) => c.receiverId === user.id
      );
      setConversations(userConvos);
    });
    return () => unsubscribe();
  }, [user]);

  const filtered = conversations.filter((msg) => {
    if (selectedFilter === "read") return msg.read === true;
    if (selectedFilter === "unread") return msg.read !== true;
    return true;
  });

  const handleLongPress = (convo: Message, e: React.MouseEvent) => {
    e.preventDefault();
    if (convo.senderId === user?.id) {
      setLongPressedMessage(convo);
      setShowDeleteDialog(true);
    }
  };

  const confirmDelete = async () => {
    if (!longPressedMessage || !user) return;
    try {
      await deleteMessageFromFirebase(user.id, longPressedMessage.id);
      setConversations((prev) =>
        prev.filter((c) => c.id !== longPressedMessage.id)
      );
    } catch (error) {
      console.error("Delete error", error);
    } finally {
      setShowDeleteDialog(false);
      setLongPressedMessage(null);
    }
  };

  return (
    <section className="messages-page">
      <div className="container">
        <h2 className="page-heading">Messages</h2>

        <div className="filter-messages">
          {["all", "read", "unread"].map((filter) => (
            <span
              key={filter}
              className={`filter-btn ${
                filter === selectedFilter ? "active" : ""
              }`}
              onClick={() => setSelectedFilter(filter)}>
              {filter}
            </span>
          ))}
        </div>

        <div className="messages-list">
          {filtered.length > 0 ? (
            filtered.map((convo) => (
              <div
                key={convo.id}
                onContextMenu={(e) => handleLongPress(convo, e)}>
                <MessageCard conversation={convo} userId={user.id} />
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>
              No {selectedFilter === "all" ? "" : selectedFilter} messages.
            </p>
          )}
        </div>
      </div>

      <Prompt
        message="Are you sure you want to delete this message?"
        isOpen={showDeleteDialog}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setLongPressedMessage(null);
        }}
      />
    </section>
  );
};

export default Messages;
