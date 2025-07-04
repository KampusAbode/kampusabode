"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { format, isToday, isYesterday } from "date-fns";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import "./admin.css";
import Loader from "../components/loader/Loader";
import { checkIsAdmin, getAllMessages } from "../utils";
import { useUserStore } from "../store/userStore";

const formatTimestamp = (timestamp: any): string => {
  const date =
    timestamp && typeof timestamp.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  if (isToday(date)) {
    return format(date, "hh:mm a");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "dd-MM-yyyy");
  }
};

const AdminChat = () => {
  const [users, setUsers] = useState<any[] | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const { user } = useUserStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    const isAdmin = checkIsAdmin(user.id);

    if (!isAdmin) {
      toast.error("Access denied: Admins only");
      router.replace("/apartment");
      return;
    }

    setAuthorized(true);
    toast.success("Access granted!");

    const unsubscribe = getAllMessages((fetchedMessages) => {
      const sortedMessages = fetchedMessages.sort((a, b) => {
        const timestampA =
          a.timestamp && typeof a.timestamp.toDate === "function"
            ? a.timestamp.toDate()
            : new Date(a.timestamp);
        const timestampB =
          b.timestamp && typeof b.timestamp.toDate === "function"
            ? b.timestamp.toDate()
            : new Date(b.timestamp);
        return timestampB.getTime() - timestampA.getTime(); // latest first
      });
      setUsers(sortedMessages);
    });

    return () => unsubscribe();
  }, [user?.id]);

  // Don't render anything until we know if user is authorized
  if (authorized === null) {
    return <Loader />;
  }

  return (
    <section className="admin-chat-page">
      <div className="container">
        <h3 className="page-heading">Users Messages</h3>
        <p>Click on a user to view messages</p>
        <ul>
          {users === null ? (
            <Loader />
          ) : users.length > 0 ? (
            users.map((msg, index) => {
              const formattedTime = formatTimestamp(msg.timestamp);
              return (
                <Link
                  href={`/adminchatroom/${msg.userName}/${msg.senderId}`}
                  key={index}
                  className="message">
                  <span className="username">{msg.userName}</span>
                  <p className="content">{msg.content}</p>
                  <span className="timestamp">{formattedTime}</span>
                </Link>
              );
            })
          ) : (
            <p>No messages yet.</p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default AdminChat;
