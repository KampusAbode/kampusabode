import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AgentUserInfo, ApartmentType, UserType } from "../fetch/types";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
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

      logoutUser: () => {
        console.log("log user out");
        set({ user: null });
      },

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

      addView: async (id) => {
        const user = get().user;
        if (!user) return;

        const currentViewed = (user.userInfo as any)
          ?.viewedProperties as string[];

        // If the property hasn't been viewed
        if (currentViewed && !currentViewed?.includes(id)) {
          const updatedUser: UserType = {
            ...user,
            userInfo: {
              ...user.userInfo,
              viewedProperties: [...currentViewed, id],
            },
          };

          set({ user: updatedUser });

          // Firestore references
          const userRef = doc(db, "users", user.id);
          const apartmentRef = doc(db, "properties", id);

          try {
            // Update user's viewedProperties
            await updateDoc(userRef, {
              "userInfo.viewedProperties": arrayUnion(id),
            });

            // Increment view count for apartment
            await updateDoc(apartmentRef, {
              views: increment(1), // Ensure 'views' exists or defaults to 0
            });
          } catch (err) {
            console.error("Error updating views:", err);
          }
        }
      },

      addListedProperty: (id) => {
        const user = get().user;
        if (!user || user.userType !== "agent") return;
        const currentListed = (user.userInfo as AgentUserInfo)
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
    }),
    {
      name: "userstore",
    }
  )
);
