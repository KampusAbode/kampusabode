import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserType } from "../fetch/types";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

interface UserState {
  users: UserType[] | null;

  setUsers: () => (() => void) | undefined;
}

export const useUsersStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: null,

      setUsers: () => {
        try {
          const usersRef = collection(db, "users");

          const unsubscribe = onSnapshot(usersRef, (snapshot) => {
            const users: UserType[] = snapshot.docs.map((doc) => {
              const data = doc.data() as UserType;
              return {
                id: doc.id,
                name: data.name || "",
                email: data.email || "",
                bio: data.bio || "",
                avatar: data.avatar || "",
                phoneNumber: data.phoneNumber || "",
                university: data.university || "",
                userType: data.userType,
                userInfo: data.userInfo,
              };
            });

            set({ users });
          });

          return unsubscribe;
        } catch (error) {
          console.error("Error fetching users in real time:", error);
        }
      },
    }),
    {
      name: "userstore",
    }
  )
);
