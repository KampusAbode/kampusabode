import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PropertyType, UserType } from "../fetch/types";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

interface UserState {
  user: UserType | null;
  setUser: (data: UserType) => void;
  logoutUser: () => void;

  // Student specific actions
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  addView: (id: string) => void;

  // Agent specific action
  addListedProperty: (id: string) => void;

  // For properties (could be used elsewhere in your app)
  properties: PropertyType[];
  setProperties: (properties: PropertyType[]) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (data) => {
        set({ user: data });
        if (data?.id) {
          // Update the Firestore user document with the new/updated user data
          const userRef = doc(db, "users", data.id);
          setDoc(userRef, data, { merge: true });
        }
      },

      logoutUser: () => set({ user: null }),

      addBookmark: (id) => {
        const user = get().user;
        if (!user || user.userType !== "student") return;
        // Cast userInfo as StudentUserInfo
        const currentSaved = (user.userInfo as any).savedProperties as string[];
        if (!currentSaved.includes(id)) {
          // Update local store state
          const updatedUser: UserType = {
            ...user,
            userInfo: {
              ...user.userInfo,
              savedProperties: [...currentSaved, id],
            },
          };
          set({ user: updatedUser });

          // Update Firestore: Add bookmark to savedProperties array
          const userRef = doc(db, "users", user.id);
          updateDoc(userRef, {
            "userInfo.savedProperties": arrayUnion(id),
          });
        }
      },

      removeBookmark: (id) => {
        const user = get().user;
        if (!user || user.userType !== "student") return;
        const currentSaved = (user.userInfo as any).savedProperties as string[];
        if (currentSaved.includes(id)) {
          const updatedUser: UserType = {
            ...user,
            userInfo: {
              ...user.userInfo,
              savedProperties: currentSaved.filter((pid: string) => pid !== id),
            },
          };
          set({ user: updatedUser });

          // Update Firestore: Remove bookmark from savedProperties array
          const userRef = doc(db, "users", user.id);
          updateDoc(userRef, {
            "userInfo.savedProperties": arrayRemove(id),
          });
        }
      },

      addView: (id) => {
        const user = get().user;
        if (!user || user.userType !== "student") return;
        const currentViewed = (user.userInfo as any)
          .viewedProperties as string[];
        if (!currentViewed.includes(id)) {
          const updatedUser: UserType = {
            ...user,
            userInfo: {
              ...user.userInfo,
              viewedProperties: [...currentViewed, id],
            },
          };
          set({ user: updatedUser });

          // Update Firestore: Add viewed property
          const userRef = doc(db, "users", user.id);
          updateDoc(userRef, {
            "userInfo.viewedProperties": arrayUnion(id),
          });
        }
      },

      addListedProperty: (id) => {
        const user = get().user;
        if (!user || user.userType !== "agent") return;
        const currentListed = (user.userInfo as any)
          .propertiesListed as string[];
        if (!currentListed.includes(id)) {
          const updatedUser: UserType = {
            ...user,
            userInfo: {
              ...user.userInfo,
              propertiesListed: [...currentListed, id],
            },
          };
          set({ user: updatedUser });

          // Update Firestore: Add property ID to agent's listedProperties
          const userRef = doc(db, "users", user.id);
          updateDoc(userRef, {
            "userInfo.propertiesListed": arrayUnion(id),
          });
        }
      },

      properties: [],
      setProperties: (properties) => set({ properties }),
    }),
    {
      name: "userstore", // persist key for Zustand
    }
  )
);
