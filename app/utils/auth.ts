
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
  updateDoc,
  query,
  where,
  getDocs,
  deleteField,
  addDoc,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  orderBy,
} from "firebase/firestore";

import CryptoJS from "crypto-js";
import { PropertyType } from "../fetch/types";

// TypeScript type for user input (based on your example)
interface UserSignupInput {
  username: string;
  email: string;
  password: string;
  userType: "student" | "agent";
  studentInfo?: {
    department: string;
  };
  agentInfo?: {
    agencyName: string;
    phoneNumber: string;
  };
}

export const signupUser = async (userData: UserSignupInput) => {
  const { email, password, userType } = userData;
  try {
    // Create user with email and password in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create additional user data based on userType
    let additionalUserData = {};
    if (userType === "student") {
      additionalUserData = {
        userType: "student",
        userInfo: {
          bio: "Not Provided",
          avatar: "Not Provided",
          university: "Not Provided",
          department: userData.studentInfo?.department,
          yearOfStudy: 1,
          savedProperties: [], // Initially empty
          wishlist: [], // Initially empty
          phoneNumber: "Not Provided",
        },
      };
    } else if (userType === "agent") {
      additionalUserData = {
        userType: "agent",
        userInfo: {
          bio: "Not Provided",
          avatar: "Not Provided",
          agencyName: userData.agentInfo?.agencyName,
          phoneNumber: userData.agentInfo?.phoneNumber,
          propertiesListed: [], // Initially empty
        },
      };
    }

    // Store user data in Firestore with additional fields
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      name: userData.username,
      email: userData.email,
      ...additionalUserData, // Add the additional properties based on userType
      createdAt: new Date(),
    });

    return { message: "signup successful" }; // Successfully signed up
  } catch (error: any) {
    // Handle Firebase Authentication errors
    if (error.code === "auth/email-already-in-use") {
      throw {
        message: "Email already in use. Please try another one.",
        statusCode: 409,
      };
    } else if (error.code === "auth/invalid-email") {
      throw {
        message: "Invalid email format. Please check your email.",
        statusCode: 400,
      };
    } else if (error.code === "auth/weak-password") {
      throw {
        message: "Password is too weak. Please use a stronger password.",
        statusCode: 400,
      };
    } else {
      console.error("error signing up user", error);
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: 500,
      };
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
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  

    // Convert userStore object to JSON string before encrypting
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(userDataFromDB), // Convert to string
      process.env.NEXT_PUBLIC__SECRET_KEY
    ).toString();

    // Store the encrypted data in localStorage
    localStorage.setItem(process.env.NEXT_PUBLIC__STORAGE_KEY, encryptedData);

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
    localStorage.removeItem(process.env.NEXT_PUBLIC__STORAGE_KEY);

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

    const storageKey = process.env.NEXT_PUBLIC__STORAGE_KEY; 
    if (!storageKey) {
      console.warn("Storage key is not defined in environment variables.");
      return { isAuthenticated: false };
    }

    const localData = localStorage.getItem(storageKey);
    return localData ? { isAuthenticated: true } : { isAuthenticated: false };
  } catch (error) {
    console.error("Error accessing authentication state:", error);
    return { isAuthenticated: false };
  }
};
