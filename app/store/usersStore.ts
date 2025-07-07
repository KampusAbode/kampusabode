import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserType } from "../fetch/types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

interface UserState {
    users: UserType[] | null;
    
  setUsers: () => void;
}

export const useUsersStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: null,

      setUsers: async () => {
        try {
          const usersRef = collection(db, "users");
          //   const agentsQuery = query(usersRef, where("userType", "==", "agent"));
          const snapshot = await getDocs(usersRef);

          const users: UserType[] = snapshot.docs.map((doc) => {
            const data = doc.data() as UserType;
            return {
              id: doc.id,
              name: (data.name as string) || "",
              email: (data.email as string) || "",
              bio: (data.bio as string) || "",
              avatar: (data.avatar as string) || "",
              phoneNumber: (data.phoneNumber as string) || "",
              university: (data.university as string) || "",
              userType: data.userType,
              userInfo: data.userInfo, 
            };
          });

          set({ users });
        } catch (error) {
          console.error("Error fetching agents:", error);
        }
      },
    }),
    {
      name: "userstore",
    }
  )
);
