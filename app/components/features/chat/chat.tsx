import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import toast from "react-hot-toast";
import { isToday, isYesterday, format } from "date-fns";
import {
  sendMessage,
  listenToMessagesForConversation,
  deleteMessageFromFirebase, // Ensure you create this in your Firebase utility
} from "../../../utils/api";
import "./chat.css";

type ChatProps = {
  currentUserId: string;
  receiverId: string;
  currentUserName: string;
  receiverName: string;
  currentUserRole: "admin" | "user";
};

const ChatComponent: React.FC<ChatProps> = ({
  currentUserId,
  receiverId,
  currentUserName,
  receiverName,
  currentUserRole,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [longPressedMessage, setLongPressedMessage] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.userdata);

  // Fetch messages
  useEffect(() => {
    if (!currentUserId || !receiverId) return;
    const userId = user?.id === currentUserId ? currentUserId : receiverId;

    const unsubscribe = listenToMessagesForConversation(
      userId,
      (fetchedMessages) => {
        const sortedMessages = fetchedMessages
          .map((msg) => ({
            ...msg,
            timestamp: msg.timestamp?.toDate
              ? msg.timestamp.toDate()
              : new Date(msg.timestamp),
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(sortedMessages);
      }
    );

    return () => unsubscribe();
  }, [currentUserId, receiverId]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    setIsLoading(true);
    const sender = {
      senderId: currentUserId,
      userName: currentUserName,
      role: currentUserRole,
    };
    try {
      const res = await sendMessage(sender, receiverId, message);
      if (res?.success) {
        setMessages((prev) => [
          ...prev,
          { senderId: currentUserId, content: message, timestamp: new Date() },
        ]);
        setMessage("");
        toast.success("Message sent!");
      } else {
        toast.error("Failed to send message.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / 60000);
    if (diffInMinutes < 1) return "Now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (isYesterday(timestamp)) return "Yesterday";
    if (isToday(timestamp)) return format(timestamp, "hh:mm a");
    return format(timestamp, "dd-MM-yyyy");
  };

  const handleLongPress = (message) => {
    if (message.senderId === currentUserId || currentUserRole === "admin") {
      setLongPressedMessage(message);
      setShowDeleteDialog(true);
    } else {
      toast.error("You can only delete your messages.");
    }
  };

  const confirmDeleteMessage = async () => {
    if (!longPressedMessage) return;
    try {
      await deleteMessageFromFirebase(longPressedMessage.id);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== longPressedMessage.id)
      );
      toast.success("Message deleted successfully.");
    } catch {
      toast.error("Failed to delete the message.");
    } finally {
      setShowDeleteDialog(false);
      setLongPressedMessage(null);
    }
  };

  return (
    <section className="chat-page">
      <div className="container">
        <div className="chat-header">
          <h4>{receiverName}</h4>
        </div>
        <div className="chat-display">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-box ${msg.senderId === currentUserId ? "right" : "left"}`}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleLongPress(msg);
                }}
              >
                <div className="message-detail">
                  <span>{formatTimestamp(msg.timestamp)}</span>
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            ))
          ) : (
            <p className="no-messages">No messages yet. Say hello!</p>
          )}
          <div ref={messagesEndRef}></div>
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            ref={inputRef}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || message.trim() === ""}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {showDeleteDialog && (
        <div className="delete-dialog">
          <div className="dialog-box">
            <p>Are you sure you want to delete this message?</p>
         <div className="btn-group">
           <button onClick={confirmDeleteMessage}>Yes</button>
          <button
            onClick={() => {
              setShowDeleteDialog(false);
              setLongPressedMessage(null);
            }}
          >
            No
          </button>
         </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ChatComponent;
