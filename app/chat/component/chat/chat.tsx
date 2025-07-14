import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInYears,
} from "date-fns";
import { FiSend } from "react-icons/fi";
import { MdBubbleChart } from "react-icons/md";
import {
  sendMessage,
  listenToMessagesForConversation,
  deleteMessageFromFirebase,
} from "../../../utils";
import "./chat.css";
import Loader from "../../../components/loader/Loader";
import Prompt from "../../../components/modals/prompt/Prompt";
import { useUserStore } from "../../../store/userStore";
import Link from "next/link";


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
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [longPressedMessage, setLongPressedMessage] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore((state) => state);



  if (!user) {
    return (
      <section className="chat-page">
        <div className="container">
          <h4 className="page-heading">Chat</h4>

          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <p>Please log in to access your chat.</p>
            <Link href="/auth/login" style={{textDecoration: "underline"}}>Log in</Link>
          </div>
        </div>
      </section>
    );
  }

  // Fetch messages
  useEffect(() => {
    if (!currentUserId || !receiverId) return;

    setIsLoadingMessages(true);
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
    setIsLoadingMessages(false);

    return () => {
      unsubscribe();
    };
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

  // Handle "Enter" key press to send the message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: any): string => {
    const now = new Date();
    const date =
      timestamp && typeof timestamp.toDate === "function"
        ? timestamp.toDate()
        : new Date(timestamp);

    const minutesDiff = differenceInMinutes(now, date);
    const hoursDiff = differenceInHours(now, date);
    const daysDiff = differenceInDays(now, date);

    if (minutesDiff < 1) return "Just now";
    if (minutesDiff < 60) return `${minutesDiff}m`;
    if (hoursDiff < 24 && isToday(date)) return `${hoursDiff}h`;
    if (isYesterday(date)) return `Yesterday at ${format(date, "h:mm a")}`;
    if (isThisWeek(date))
      return `${format(date, "EEEE")} at ${format(date, "h:mm a")}`;
    if (isThisYear(date)) return format(date, "MMM d");
    return format(date, "MMM d, yyyy");
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
      const userId = user?.id === currentUserId ? currentUserId : receiverId;
      await deleteMessageFromFirebase(userId, longPressedMessage.id);
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

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setLongPressedMessage(null);
  };

  return (
    <section className="chat-page">
      <div className="chat-header">
        <div className="container">
          <h4 className="page-heading">{receiverName}</h4>
        </div>
      </div>

      <div className="chat-display">
        <div className="container">
          {isLoadingMessages ? (
            <Loader />
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-box ${
                  msg.senderId === currentUserId ? "right" : "left"
                }`}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleLongPress(msg);
                }}>
                <div className="message-detail">
                  <span>{formatTimestamp(msg.timestamp)}</span>
                </div>
                <div className="message-content">
                  <span>{msg.content}</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{textAlign: 'center'}}>No messages yet.</p>
          )}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      <div className="chat-input">
        <div className="container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            ref={inputRef}
          />
          <button
            className="btn"
            onClick={handleSendMessage}
            disabled={isLoading || message.trim() === ""}>
            {isLoading ? <MdBubbleChart /> : <FiSend />}
          </button>
        </div>
      </div>

      <Prompt
        message="Are you sure you want to delete this message?"
        isOpen={showDeleteDialog}
        onConfirm={confirmDeleteMessage}
        onCancel={cancelDelete}
      />
    </section>
  );
};

export default ChatComponent;
