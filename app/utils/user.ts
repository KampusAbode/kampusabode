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

    // Fetch the document
    const userData = await getDoc(usersDocRef);

    // Check if the document exists and return user data
    if (userData.exists()) {
      return userData.data() as UserType;
    } else {
      throw new Error("No user found with the specified ID");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching user by ID: ${error.message}`);
    }
    throw new Error("Unknown error occurred while fetching user by ID");
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
    const userDocRef = doc(db, "users", userId);

    // Update the document
    await updateDoc(userDocRef, updates);

    // Fetch the updated document
    const updatedDoc = await getDoc(userDocRef);

    if (!updatedDoc.exists()) {
      throw new Error("User not found after update.");
    }

    return {
      success: true,
      message: "Profile updated successfully!",
      userData: updatedDoc.data(),
    };
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