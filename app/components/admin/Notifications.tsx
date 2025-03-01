"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const isInitialRender = useRef(true); // Track initial render

  useEffect(() => {
    const listenToCollection = (collectionName, label) => {
      return onSnapshot(collection(db, collectionName), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const newNotification = {
            id: change.doc.id,
            message: `${label} ${change.type}`,
            timestamp: new Date().toISOString(),
          };

          // Save notifications in Firestore
          const notificationRef = doc(db, "notifications", newNotification.id);
          setDoc(notificationRef, newNotification, { merge: true });

          // Update local state
          setNotifications((prev) => [newNotification, ...prev]);

          // ✅ Only show toast if it's NOT the first render
          if (!isInitialRender.current) {
            toast(`🔔 ${newNotification.message}`, {
              duration: 5000,
              position: "top-right",
              style: {
                borderRadius: "8px",
                background: "#333",
                color: "#fff",
              },
            });
          }
        });
      });
    };

    // Attach real-time listeners to collections
    const unsubUsers = listenToCollection("users", "User");
    const unsubProperties = listenToCollection("properties", "Property");
    const unsubReviews = listenToCollection("Reviews", "Review");
    const unsubMarketItems = listenToCollection("Marketitems", "Market Item");
    const unsubComments = listenToCollection("comments", "Comment");
    const unsubConversations = listenToCollection(
      "conversations",
      "Conversation"
    );
    const unsubTrends = listenToCollection("trends", "Trend");

    // ✅ Set initial render flag to false after first load
    setTimeout(() => {
      isInitialRender.current = false;
    }, 1000);

    // Cleanup function
    return () => {
      unsubUsers();
      unsubProperties();
      unsubReviews();
      unsubMarketItems();
      unsubComments();
      unsubConversations();
      unsubTrends();
    };
  }, []);

  // Delete a specific notification
  const deleteNotification = async (id) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );

      // Show success toast
      toast.success("Notification deleted successfully!", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification!", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="notifications">
      <h3>Notifications</h3>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <li key={index} className="notification-item">
              {notification.message}
              <button onClick={() => deleteNotification(notification.id)}>
                ❌
              </button>
            </li>
          ))
        ) : (
          <p>No recent updates.</p>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
