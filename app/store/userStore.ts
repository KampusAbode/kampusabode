import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AgentUserInfo, UserType, StudentUserInfo } from "../fetch/types";
import {
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
  addBookmark: (id: string) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  addViewedProperties: (id: string) => Promise<void>;
  addViewedTrends: (id: string) => Promise<void>;

  // Agent specific action
  addListedProperty: (id: string) => Promise<void>;

  // Roomie profile
  hasRoomieProfile: boolean;
  roomieProfileId?: string;
  setRoomieProfileId: (id: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      hasRoomieProfile: false,
      roomieProfileId: undefined,

      setUser: (data) => {
        set({ user: data });
        if (data?.id) {
          const userRef = doc(db, "users", data.id);
          setDoc(userRef, data, { merge: true }).catch((err) => {
            console.error("Error setting user in Firestore:", err);
          });
        }
      },

      logoutUser: () => {
        set({ user: null, hasRoomieProfile: false, roomieProfileId: undefined });
      },

      setRoomieProfileId: (id) => {
        set({ roomieProfileId: id, hasRoomieProfile: true });
      },

      addBookmark: async (id) => {
        const user = get().user;
        if (!user || user.userType !== "student") return;

        const studentInfo = user.userInfo as StudentUserInfo;
        const currentSaved = studentInfo.savedProperties || [];
        
        if (currentSaved.includes(id)) return;

        try {
          // Update Firestore first
          const userRef = doc(db, "users", user.id);
          await updateDoc(userRef, {
            "userInfo.savedProperties": arrayUnion(id),
          });

          // Update local state after successful Firestore update
          const updatedUser: UserType = {
            ...user,
            userInfo: {
              ...studentInfo,
              savedProperties: [...currentSaved, id],
            },
          };
          set({ user: updatedUser });
        } catch (err) {
          console.error("Error adding bookmark:", err);
          throw err;
        }
      },

      removeBookmark: async (id) => {
        const user = get().user;
        if (!user || user.userType !== "student") return;

        const studentInfo = user.userInfo as StudentUserInfo;
        const currentSaved = studentInfo.savedProperties || [];
        
        if (!currentSaved.includes(id)) return;

        try {
          // Update Firestore first
          const userRef = doc(db, "users", user.id);
          await updateDoc(userRef, {
            "userInfo.savedProperties": arrayRemove(id),
          });

          // Update local state after successful Firestore update
          const updatedUser: UserType = {
            ...user,
            userInfo: {
              ...studentInfo,
              savedProperties: currentSaved.filter((pid) => pid !== id),
            },
          };
          set({ user: updatedUser });
        } catch (err) {
          console.error("Error removing bookmark:", err);
          throw err;
        }
      },

      addViewedProperties: async (id) => {
        const user = get().user;
        if (!user) return;

        const currentViewed = (user.userInfo as any)?.viewedProperties as string[] || [];

        if (currentViewed.includes(id)) return;

        try {
          const userRef = doc(db, "users", user.id);
          const apartmentRef = doc(db, "properties", id);

          // Update both Firestore documents
          await Promise.all([
            updateDoc(userRef, {
              "userInfo.viewedProperties": arrayUnion(id),
            }),
            updateDoc(apartmentRef, {
              views: increment(1),
            }),
          ]);

          // Update local state after successful Firestore updates
          const updatedUser: UserType = {
            ...user,
            userInfo: {
              ...user.userInfo,
              viewedProperties: [...currentViewed, id],
            },
          };
          set({ user: updatedUser });
        } catch (err) {
          console.error("Error updating property views:", err);
          throw err;
        }
      },

      addViewedTrends: async (id) => {
        const user = get().user;
        if (!user) return;

        const currentViewed: string[] = Array.isArray(user.userInfo?.viewedTrends)
          ? user.userInfo.viewedTrends
          : [];

        if (currentViewed.includes(id)) return;

        try {
          const userRef = doc(db, "users", user.id);
          const trendRef = doc(db, "trends", id);

          // Update both Firestore documents
          await Promise.all([
            updateDoc(userRef, {
              "userInfo.viewedTrends": arrayUnion(id),
            }),
            updateDoc(trendRef, {
              views: increment(1),
            }),
          ]);

          // Update local state after successful Firestore updates
          const updatedUser: UserType = {
            ...user,
            userInfo: {
              ...user.userInfo,
              viewedTrends: [...currentViewed, id],
            },
          };
          set({ user: updatedUser });
        } catch (err) {
          console.error("Error updating trend views:", err);
          throw err;
        }
      },

      addListedProperty: async (id) => {
        const user = get().user;
        if (!user || user.userType !== "agent") return;

        const agentInfo = user.userInfo as AgentUserInfo;
        const currentListed = agentInfo.propertiesListed || [];
        
        if (currentListed.includes(id)) return;

        try {
          // Update Firestore first
          const userRef = doc(db, "users", user.id);
          await updateDoc(userRef, {
            "userInfo.propertiesListed": arrayUnion(id),
          });

          // Update local state after successful Firestore update
          const updatedUser: UserType = {
            ...user,
            userInfo: {
              ...agentInfo,
              propertiesListed: [...currentListed, id],
            },
          };
          set({ user: updatedUser });
        } catch (err) {
          console.error("Error adding listed property:", err);
          throw err;
        }
      },
    }),
    {
      name: "userstore",
    }
  )
);