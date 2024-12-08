"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  sendMessage,
  getMessagesForConversation,
} from "../../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
// import { useRouter } from "next/navigation";
import "./adminchat.css";
import { format } from "date-fns";

type Params = {
  params: { id: string };
};

const Chat = ({ params }: Params) => {
  const receiverId = params.id;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // const router = useRouter();
  const user = useSelector((state: RootState) => state.userdata);

  // Fetch messages for this user
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const fetchedMessages = await getMessagesForConversation(receiverId);
        console.log(fetchedMessages);

        setMessages(fetchedMessages || []);
      } catch (error) {
        toast.error("Failed to load messages.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [receiverId]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  type Sender = {
    senderId: string;
    userName: string;
  };
  // Send a message
  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    setIsLoading(true);
    try {
      const sender: Sender = {
        senderId: "Kampusabode",
        userName: "Kampusabode",
      };

      const res = await sendMessage(sender, receiverId, message, true);

      if (res.success) {
        toast.success("Message sent!");
        setMessages((prevMessages) => [
          ...prevMessages,
          { senderId: "Kampusabode", content: message, timestamp: new Date() },
        ]);
        setMessage("");
        inputRef.current?.focus();
        setIsLoading(false);
      } else {
        toast.error("Failed to send message. Try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <section className="chat-page">
      <div className="container" style={{ padding: "1rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Chat with users
        </h2>

        <div className="display">
          {isLoading ? (
            <p style={{ textAlign: "center" }}>Loading messages...</p>
          ) : messages && messages.length > 0 ? (
            messages.map((msg, index) => {
              const timestamp = msg.timestamp?.toDate
                ? msg.timestamp.toDate()
                : new Date();
              const formattedTime = format(timestamp, "hh:mm a");

              return (
                <div
                  key={index}
                  className={
                    msg.senderId === receiverId
                      ? "message-box"
                      : "message-box right"
                  }>
                  <div className="message-detaile">
                    {msg.senderId === receiverId ? (
                      <>
                        <span>Kampusabode</span> <span>{formattedTime}</span>
                      </>
                    ) : (
                      <>
                        <span>{formattedTime}</span>
                        <span>YOU</span>{" "}
                      </>
                    )}
                  </div>
                  <div className="message-content">
                    <span>{msg.content}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: "center" }}>No messages yet. Say hello!</p>
          )}
        </div>

        <div className="message-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            // ref={inputRef}

            aria-label="Message Input"
          />
          <button
            onClick={handleSendMessage}
            className="btn"
            disabled={isLoading || message.trim() === ""}
            aria-label="Send Message">
            Send
          </button>
        </div>
      </div>
    </section>
  );
};

export default Chat;
