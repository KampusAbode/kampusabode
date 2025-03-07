"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Helper function: returns a listener that skips the initial load
    const listenToCollection = (collectionName, label) => {
      let isInitialLoad = true; // flag for this listener

      return onSnapshot(collection(db, collectionName), (snapshot) => {
        // If this is the initial load, just mark flag as false and do not process notifications
        if (isInitialLoad) {
          isInitialLoad = false;
          return;
        }

        // For subsequent changes, process the docChanges
        snapshot.docChanges().forEach((change) => {
          const newNotification = {
            id: change.doc.id,
            message: `New ${label} ${change.type}`,
            timestamp: new Date().toISOString(),
          };

          // Save notification to Firestore (for persistence if needed)
          const notificationRef = doc(db, "notifications", newNotification.id);
          setDoc(notificationRef, newNotification, { merge: true });

          // Update local state
          setNotifications((prev) => [newNotification, ...prev]);

          // Show toast notification
          toast(`🔔 ${newNotification.message}`, {
            duration: 5000,
            position: "top-right",
            style: {
              borderRadius: "8px",
              background: "#333",
              color: "#fff",
            },
          });
        });
      });
    };

    // Attach real-time listeners to collections
    const unsubUsers = listenToCollection("users", "user");
    const unsubProperties = listenToCollection("properties", "property");
    const unsubReviews = listenToCollection("Reviews", "review");
    const unsubMarketItems = listenToCollection("Marketitems", "market item");
    const unsubComments = listenToCollection("comments", "comment");
    const unsubConversations = listenToCollection(
      "conversations",
      "Conversation"
    );
    const unsubTrends = listenToCollection("trends", "Trend");

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
