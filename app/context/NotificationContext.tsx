"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import CryptoJS from "crypto-js";
import { db } from "../lib/firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";

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

const LOCAL_STORAGE_KEY = "persist_notifications";

// Decrypt and get stored user data from localStorage
const getStoredUserData = (): any => {
  try {
    const encryptedData = localStorage.getItem(
      process.env.NEXT_PUBLIC__USERDATA_STORAGE_KEY!
    );
    if (!encryptedData) return null;
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      process.env.NEXT_PUBLIC__ENCSECRET_KEY!
    ).toString(CryptoJS.enc.Utf8);
    return decryptedData ? JSON.parse(decryptedData) : null;
  } catch (error) {
    console.error("Error decrypting user data:", error);
    return null;
  }
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
        }
      } catch (error) {
        console.error("Error parsing notifications from localStorage:", error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    // Check if the current user is an admin
    const userData = getStoredUserData();
    if (!userData || userData.id !== process.env.NEXT_PUBLIC_ADMINS) {
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
    const unsubComments = listenToCollection("comments", "comment");
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
