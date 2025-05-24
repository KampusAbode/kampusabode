// authService.ts
import { db, auth } from "../lib/firebaseConfig";
import { getAuth } from "firebase/auth";
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
  getDoc,
} from "firebase/firestore";
import { UserSignupInput } from "../auth/signup/page";
import { UserType } from "../fetch/types";
import { useUserStore } from "../store/userStore";

// Utility to set session storage with expiry
// const setSessionData = (key: string, data: {isAuthenticated: boolean}, ttlMs: number) => {
//   const expiry = Date.now() + ttlMs;
//   const value = { data, expiry };
//   sessionStorage.setItem(key, JSON.stringify(value));
// };

// // Utility to get session data and validate expiry
// export const getSessionData = (key: string) => {
//   const itemStr = sessionStorage.getItem(key);
//   if (!itemStr) return null;
//   try {
//     const item = JSON.parse(itemStr);
//     if (Date.now() > item.expiry) {
//       sessionStorage.removeItem(key);
//       return null;
//     }
//     return item.data;
//   } catch (err) {
//     console.error("Failed to parse session data", err);
//     return null;
//   }
// };

export const signupUser = async (userData: UserSignupInput) => {
  const { email, password, userType, university, avatar, phoneNumber } =
    userData;

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const newUser: UserType = {
      id: user.uid,
      name: userData.username,
      email: email,
      bio: "",
      avatar: avatar || "",
      phoneNumber: phoneNumber || "",
      university: university || "",
      userType,
      userInfo:
        userType === "student"
          ? {
              department: userData.studentInfo?.department || "",
              currentYear: parseInt(userData.studentInfo?.currentYear || "1"),
              savedProperties: [],
              viewedProperties: [],
              wishlist: [],
            }
          : {
              agencyName: userData.agentInfo?.agencyName || "",
              propertiesListed: [],
            },
    };

    // Store user data directly in Firestore
    await setDoc(doc(db, "users", user.uid), {
      ...newUser,
      createdAt: new Date().toISOString(),
    });

    return { message: "Signup successful" };
  } catch (error: any) {
    console.error("Error signing up user", error);
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

    const userDataFromDB = userRef.docs[0].data() as UserType;

    // Sign in user with Firebase Auth
    await signInWithEmailAndPassword(auth, email, password);
    const userId = userDataFromDB.id;
    useUserStore.getState().setUser(userDataFromDB);

    return { message: `Welcome abode! ${userDataFromDB.name}`, userId };
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.code === "auth/invalid-credential") {
      throw {
        message: "Incorrect credentials. Please try again.",
        statusCode: 401,
      };
    } else if (error.code === "auth/user-not-found") {
      throw { message: "User not found. Please sign up.", statusCode: 404 };
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
    await auth.signOut();

    if (typeof window !== "undefined") {
      sessionStorage.removeItem(process.env.NEXT_PUBLIC_USERDATA_STORAGE_KEY!);
      sessionStorage.setItem("hasSeenWelcome", JSON.stringify(false));
    }

    // Also clear the Zustand user state
    useUserStore.getState().logoutUser();

    return { message: "Successfully logged out" };
  } catch (error: any) {
    console.error("Logout error:", error);
    throw {
      message: error.message || "Error logging out",
      statusCode: 500,
    };
  }
};

// export const getAuthState = async (): Promise<{ isAuthenticated: boolean }> => {
//   try {
    // if (typeof window === "undefined") {
    //   return { isAuthenticated: false };
    // }

    // const storageKey = process.env.NEXT_PUBLIC_USERDATA_STORAGE_KEY;
    // if (!storageKey) {
    //   console.warn("Storage key is not defined in environment variables.");
    //   return { isAuthenticated: false };
    // }

    // const sessionDataStr = sessionStorage.getItem(storageKey);
    // console.log({"sessionDataStr": sessionDataStr})
    // if (!sessionDataStr) return { isAuthenticated: false };

    
    // const { expiry } = JSON.parse(sessionDataStr);
    // if (Date.now() > expiry) {
    //   console.log({"currentDATE": Date.now(), "expiry": expiry})
    //   sessionStorage.removeItem(storageKey);
    //   return { isAuthenticated: false };
    // }

    // return { isAuthenticated: true };
//       const auth = getAuth(); 
//       return { isAuthenticated: !!auth.currentUser };
//   } catch (error) {
//     console.error("Error accessing authentication state:", error);
//     return { isAuthenticated: false };
//   }
// };

