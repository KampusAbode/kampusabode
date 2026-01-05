import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AgentUserInfo,
  UserType,
  StudentUserInfo,
  ApartmentType,
} from "../fetch/types";
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

  // Properties state (for agent listings)
  properties: ApartmentType[];
  propertiesLoading: boolean;
  propertiesError: string | null;
  setProperties: (properties: ApartmentType[]) => void;
  removeProperty: (id: string) => void;
  setPropertiesLoading: (loading: boolean) => void;
  setPropertiesError: (error: string | null) => void;

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

      // Properties state initialization
      properties: [],
      propertiesLoading: false,
      propertiesError: null,

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
        set({
          user: null,
          hasRoomieProfile: false,
          roomieProfileId: undefined,
          properties: [],
          propertiesLoading: false,
          propertiesError: null,
        });
      },

      setRoomieProfileId: (id) => {
        set({ roomieProfileId: id, hasRoomieProfile: true });
      },

      // Properties management methods
      setProperties: (properties) => set({ properties }),

      removeProperty: (id) => {
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== id),
        }));

        // Also remove from user's propertiesListed array
        const user = get().user;
        if (user && user.userType === "agent") {
          const agentInfo = user.userInfo as AgentUserInfo;
          const updatedUser: UserType = {
            ...user,
            userInfo: {
              ...agentInfo,
              propertiesListed: (agentInfo.propertiesListed || []).filter(
                (pid) => pid !== id
              ),
            },
          };
          set({ user: updatedUser });
        }
      },

      setPropertiesLoading: (loading) => set({ propertiesLoading: loading }),

      setPropertiesError: (error) => set({ propertiesError: error }),

      addBookmark: async (id) => {
        const user = get().user;
        if (!user || user.userType !== "student") return;

        const studentInfo = user.userInfo as StudentUserInfo;
        const currentSaved = studentInfo.savedProperties || [];

        if (currentSaved.includes(id)) return;

        try {
          const userRef = doc(db, "users", user.id);
          await updateDoc(userRef, {
            "userInfo.savedProperties": arrayUnion(id),
          });

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
          const userRef = doc(db, "users", user.id);
          await updateDoc(userRef, {
            "userInfo.savedProperties": arrayRemove(id),
          });

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

        const currentViewed =
          ((user.userInfo as any)?.viewedProperties as string[]) || [];

        if (currentViewed.includes(id)) return;

        try {
          const userRef = doc(db, "users", user.id);
          const apartmentRef = doc(db, "properties", id);

          await Promise.all([
            updateDoc(userRef, {
              "userInfo.viewedProperties": arrayUnion(id),
            }),
            updateDoc(apartmentRef, {
              views: increment(1),
            }),
          ]);

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

        const currentViewed: string[] = Array.isArray(
          user.userInfo?.viewedTrends
        )
          ? user.userInfo.viewedTrends
          : [];

        if (currentViewed.includes(id)) return;

        try {
          const userRef = doc(db, "users", user.id);
          const trendRef = doc(db, "trends", id);

          await Promise.all([
            updateDoc(userRef, {
              "userInfo.viewedTrends": arrayUnion(id),
            }),
            updateDoc(trendRef, {
              views: increment(1),
            }),
          ]);

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
          const userRef = doc(db, "users", user.id);
          await updateDoc(userRef, {
            "userInfo.propertiesListed": arrayUnion(id),
          });

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
