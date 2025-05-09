"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { db } from "../lib/firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { useUserStore } from "../store/userStore";

export type Notification = {
  id: string;
  message: string;
  timestamp: string;
};

type NotificationContextType = {
  notifications: Notification[];
  deleteNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user || user.id !== process.env.NEXT_PUBLIC_ADMINS) {
      // Not an admin; do not attach notification listeners
      return;
    }

    // Helper: returns a listener that skips the initial snapshot
    const listenToCollection = (collectionName: string, label: string) => {
      let isInitialLoad = true;
      return onSnapshot(collection(db, collectionName), (snapshot) => {
        if (isInitialLoad) {
          isInitialLoad = false;
          return;
        }
        snapshot.docChanges().forEach((change) => {
          const newNotification: Notification = {
            id: change.doc.id,
            message: `New ${label} ${change.type}`,
            timestamp: new Date().toISOString(),
          };

          // Persist the notification in Firestore if needed
          const notificationRef = doc(db, "notifications", newNotification.id);
          setDoc(notificationRef, newNotification, { merge: true });

          // Update state by prepending the new notification
          setNotifications((prev) => [newNotification, ...prev]);

          // Play a notification sound
          const audio = new Audio("/sound/notification.mp3");
          audio
            .play()
            .catch((error) =>
              console.error("Error playing notification sound:", error)
            );

          // Show a toast notification
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

    const unsubUsers = listenToCollection("users", "user");
    const unsubProperties = listenToCollection("properties", "property");
    const unsubReviews = listenToCollection("Reviews", "review");
    const unsubMarketItems = listenToCollection("Marketitems", "market item");
    const unsubComments = listenToCollection("trendcomments", "comment");
    const unsubConversations = listenToCollection(
      "conversations",
      "conversation"
    );
    const unsubTrends = listenToCollection("trends", "trend");

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

  // Delete a notification from state and Firestore
  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
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
    <NotificationContext.Provider value={{ notifications, deleteNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
