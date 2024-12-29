import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { UserType } from "../fetch/types";


const db = getFirestore();

export const fetchUsersById = async (userId: string) => {
  try {
    // Reference to the "users" collection
    const usersCollection = collection(db, "users");

    // Build the query
    const usersQuery = query(usersCollection, where("id", "==", userId));

    // Fetch the documents
    const querySnapshot = await getDocs(usersQuery);

    // Map through the documents and return their data
    const user: UserType = querySnapshot.docs.map((doc) => {
      const data = doc.data() as UserType;
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        userType: data.userType,
        userInfo: data.userInfo,
      } as UserType;
    })[0];

    return user;
  } catch (error) {
    console.error("Error fetching users by property ID:", error);
    throw error;
  }
};
