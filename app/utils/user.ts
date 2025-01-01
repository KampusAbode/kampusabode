import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { UserType } from "../fetch/types";

const db = getFirestore();

export const fetchUsersById = async (userId: string) => {
  try {
    // Reference to the "users" collection
    const usersDocRef = doc(db, "users", userId);

    // Build the query
    // const usersQuery = query(usersCollection, where("id", "==", userId));

    // Fetch the documents
    const userData = await getDoc(usersDocRef);

    // check if there are results and return the first user's data
    if (!userData.exists) {
      const data = userData.data() as UserType;
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        userType: data.userType,
        userInfo: data.userInfo,
      } as UserType;
    } else {
      throw new Error("No user found with the specified ID");
    }
  } catch (error) {
    throw new Error("Error fetching users by property ID");
  }
};



export const saveUserProfile = async (userId: string, userData: UserType) => {
  try {
    // Reference to the "users" collection
    const userDocRef = doc(db, "users", userId);

    await setDoc(userDocRef, userData, { merge: true });

    return {success: true, message: "profile created successfully!"}
  } catch (error) {
    
    throw new Error("Failed to save profile");
  }
};


export const updateUserProfile = async (userId: string, updates) => {
  try {
    // Reference to the "users" collection
    const userDocRef = doc(db, "users", userId);

    await updateDoc(userDocRef, updates);

    return { success: true, message: "profile updated successfully!" };
  } catch (error) {
    throw new Error("Failed to update profile.");
  }
};


