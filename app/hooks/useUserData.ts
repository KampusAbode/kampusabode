// hooks/useUserData.ts
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useState } from "react";
import { db } from "../lib/firebaseConfig";


export const useUserData = (uid: string | null) => {
  const [loading, setLoading] = useState(false);

  const getUserData = async () => {
    if (!uid) return null;
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  };

  const bookmarkProperty = async (propertyId: string) => {
    if (!uid) return;
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      bookmarkedProperties: arrayUnion(propertyId),
    });
  };

  const removeBookmark = async (propertyId: string) => {
    if (!uid) return;
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      bookmarkedProperties: arrayRemove(propertyId),
    });
  };

  const addViewedProperty = async (propertyId: string) => {
    if (!uid) return;
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      viewedProperties: arrayUnion(propertyId),
    });
  };

  return {
    getUserData,
    bookmarkProperty,
    removeBookmark,
    addViewedProperty,
    loading,
  };
};

