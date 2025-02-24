// import axios from "axios";
import { db, auth } from "../lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import CryptoJS from "crypto-js";
import { UserSignupInput } from "../auth/signup/page";
import { UserType } from "../fetch/types";
// import { PropertyType } from "../fetch/types";



export const signupUser = async (userData: UserSignupInput) => {
  const { email, password, userType, university, avatar, phoneNumber } = userData;

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Construct user data
    const newUser: UserType = {
      id: user.uid,
      name: userData.username,
      email: email,
      bio: "", // Default empty bio
      avatar: avatar || "", // Default empty avatar
      phoneNumber: phoneNumber || "", // Default empty phone number
      university: university || "",
      userType: userType,
      userInfo:
        userType === "student"
          ? {
              department: userData.studentInfo?.department || "",
              currentYear: parseInt(userData.studentInfo?.currentYear || "1"), // Ensure number type
              savedProperties: [],
              wishlist: [],
            }
          : {
              agencyName: userData.agentInfo?.agencyName || "",
              propertiesListed: [],
            },
    };

    // Store user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      ...newUser,
      createdAt: new Date(),
    });

    return { message: "Signup successful" };
  } catch (error: any) {
    console.error("Error signing up user", error);

    if (error.code === "auth/email-already-in-use") {
      throw { message: "Email already in use. Please try another one.", statusCode: 409 };
    } else if (error.code === "auth/invalid-email") {
      throw { message: "Invalid email format. Please check your email.", statusCode: 400 };
    } else if (error.code === "auth/weak-password") {
      throw { message: "Password is too weak. Please use a stronger password.", statusCode: 400 };
    } else {
      throw { message: "Something went wrong. Please try again later.", statusCode: 500 };
    }
  }
};





interface UserLoginInput {
  email: string;
  password: string;
}
export const loginUser = async (userData: UserLoginInput) => {
  const { email, password } = userData;

  try {
    // Query Firestore for user by email
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const userRef = await getDocs(userQuery);

    if (userRef.empty) {
      return { message: "Email not found", statusCode: 404 };
    }

    const userDataFromDB = userRef.docs[0].data();

    // Sign in with email and password using Firebase Auth
    await signInWithEmailAndPassword(auth, email, password);

    // Convert userStore object to JSON string before encrypting
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(userDataFromDB), // Convert to string
      process.env.NEXT_PUBLIC__ENCSECRET_KEY
    ).toString();

    // Store the encrypted data in localStorage
    localStorage.setItem(
      process.env.NEXT_PUBLIC__USERDATA_STORAGE_KEY,
      encryptedData
    );

    return { message: `Welcome abode! ${userDataFromDB.name}` };
  } catch (error) {
    // Check for Firebase Auth error codes
    if (error.code === "auth/invalid-credential") {
      throw {
        message: "Incorrect credentials. Please try again.",
        statusCode: 401,
      };
    } else if (error.code === "auth/user-not-found") {
      throw {
        message: "User not found. Please sign up.",
        statusCode: 404,
      };
    } else if (error.code === "") {
      throw { message: "Email not found", statusCode: 404 };
    } else {
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: 500,
      };
    }
  }
};

export const logoutUser = async () => {
  try {
    // Sign out the user from Firebase Authentication
    await auth.signOut();

    localStorage.setItem("hasSeenWelcome", JSON.stringify(false));
    localStorage.removeItem(process.env.NEXT_PUBLIC__USERDATA_STORAGE_KEY);

    return { message: "Successfully logged out" };
  } catch (error) {
    // Handle Firebase specific errors or other issues
    if (error.code) {
      // Firebase error
      throw {
        message: error.message || "Error logging out from Firebase",
        statusCode: 500,
      };
    } else {
      // General error (like decryption failure or other unexpected issues)
      throw {
        message: error.message || "Error logging out",
        statusCode: 500,
      };
    }
  }
};

export const getAuthState = async (): Promise<{ isAuthenticated: boolean }> => {
  try {
    // Ensure localStorage is accessible (browser-only check)
    if (typeof window === "undefined") {
      return { isAuthenticated: false };
    }

    const userDataStorageKey = process.env.NEXT_PUBLIC__USERDATA_STORAGE_KEY;
    if (!userDataStorageKey) {
      console.warn("Storage key is not defined in environment variables.");
      return { isAuthenticated: false };
    }

    const localData = localStorage.getItem(userDataStorageKey);
    return localData ? { isAuthenticated: true } : { isAuthenticated: false };
  } catch (error) {
    console.error("Error accessing authentication state:", error);
    return { isAuthenticated: false };
  }
};
