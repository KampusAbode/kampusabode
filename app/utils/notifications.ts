// lib/server/notificationHandler.ts
import { db } from "../lib/firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  DocumentChange,
} from "firebase/firestore";

const listenToCollection = (
  collectionName: string,
  label: string,
  callback: (notif: any) => void
) => {
  let isInitialLoad = true;
  return onSnapshot(collection(db, collectionName), (snapshot) => {
    if (isInitialLoad) {
      isInitialLoad = false;
      return;
    }

    snapshot.docChanges().forEach((change: DocumentChange) => {
      const newNotification = {
        id: change.doc.id,
        message: `New ${label} ${change.type}`,
        timestamp: new Date().toISOString(),
      };

      const ref = doc(db, "notifications", newNotification.id);
      setDoc(ref, newNotification, { merge: true });

      callback(newNotification);
    });
  });
};

export const startNotificationListeners = (
  callback: (notif: any) => void
): (() => void) => {
  const unsubUsers = listenToCollection("users", "user", callback);
  const unsubProperties = listenToCollection("properties", "property", callback);
  const unsubReviews = listenToCollection("Reviews", "review", callback);
  const unsubMarketItems = listenToCollection("Marketitems", "market item", callback);
  const unsubComments = listenToCollection("comments", "comment", callback);
  const unsubConversations = listenToCollection("conversations", "conversation", callback);
  const unsubTrends = listenToCollection("trends", "trend", callback);

  return () => {
    unsubUsers();
    unsubProperties();
    unsubReviews();
    unsubMarketItems();
    unsubComments();
    unsubConversations();
    unsubTrends();
  };
};
