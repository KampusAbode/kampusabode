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

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Function to listen for real-time changes in a collection
    const listenToCollection = (collectionName, label) => {
      return onSnapshot(collection(db, collectionName), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const newNotification = {
            id: change.doc.id,
            message: `${label} ${change.type}: ${JSON.stringify(
              change.doc.data()
            )}`,
            timestamp: new Date().toISOString(),
          };

          // Save notifications in Firestore for persistence
          const notificationRef = doc(db, "notifications", newNotification.id);
          setDoc(notificationRef, newNotification, { merge: true });

          // Update local state
          setNotifications((prev) => [newNotification, ...prev]);
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
    } catch (error) {
      console.error("Error deleting notification:", error);
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
