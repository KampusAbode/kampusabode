import { useEffect, useState, useRef } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import toast from "react-hot-toast";

const db = getFirestore();

export interface Notification {
  id: string;
  from: string;
  to: string;
  message: string;
  title?: string;
  type?: string;
  link?: string;
  imageUrl?: string;
  read: boolean;
  sentDate: Timestamp;
}

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const firstLoad = useRef(true); // to prevent toasting on first mount

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("to", "==", userId),
      orderBy("sentDate", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const incomingNotifs: Notification[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Notification, "id">),
      }));

      const previousIds = new Set(notifications.map((n) => n.id));
      const newUnseenNotifs = incomingNotifs.filter(
        (n) => !previousIds.has(n.id) && !n.read
      );

      // 🔔 Toast new notifications (only after initial mount)
      if (!firstLoad.current && newUnseenNotifs.length > 0) {
        newUnseenNotifs.forEach((notif) => {
          toast(notif.message, {
            icon: "📩",
            duration: 5000,
          });
        });
      }

      setNotifications(incomingNotifs);
      setLoading(false);
      firstLoad.current = false;

      // ✅ Auto-mark unread as read
      const unread = incomingNotifs.filter((n) => !n.read);
      if (unread.length > 0) {
        const batch = writeBatch(db);
        unread.forEach((n) => {
          const ref = doc(db, "notifications", n.id);
          batch.update(ref, { read: true });
        });
        await batch.commit();
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return { notifications, loading };
}
