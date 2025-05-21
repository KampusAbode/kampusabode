// hooks/useAuthListener.ts
"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebaseConfig";
import { useUserStore } from "../store/userStore";
import { UserType } from "../fetch/types";

export function useAuthListener() {
  const [initializing, setInitializing] = useState(true);
  const { setUser, logoutUser } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const snap = await getDoc(doc(db, "users", fbUser.uid));
          if (snap.exists()) {
            setUser(snap.data() as UserType);
          }
        } catch (err) {
          console.error("Error fetching Firestore user:", err);
          logoutUser();
        }
      } else {
        logoutUser();
      }
      setInitializing(false);
    });
    return () => unsubscribe();
  }, [setUser, logoutUser]);

  return { initializing };
}
