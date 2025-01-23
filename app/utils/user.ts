import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { UserType } from "../fetch/types";
import { db } from "../lib/firebaseConfig";

export const fetchUsersById = async (userId: string) => {
  try {
    // Reference to the "users" collection
    const usersDocRef = doc(db, "users", userId);

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


export const updateBookmarkInDB = async (
  userId: string,
  propertyId: string,
  action: "add" | "remove"
) => {
  const userRef = doc(db, "users", userId);

  try {
    if (action === "add") {
      await updateDoc(userRef, {
        "userInfo.savedProperties": arrayUnion(propertyId),
      });
    } else {
      await updateDoc(userRef, {
        "userInfo.savedProperties": arrayRemove(propertyId),
      });
    }
  } catch (error) {
    console.error("Failed to update bookmarks in Firebase:", error);
    throw new Error("Database update failed.");
  }
};