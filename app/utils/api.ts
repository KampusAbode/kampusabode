//   app/utils/api.js

import axios from "axios";
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
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const token = await user.getIdToken();

    const userAuth = {
      id: user.uid,
      email: user.email,
      username: userDataFromDB.username,
      userType: userDataFromDB.userType,
      isAuthenticated: true, // User logged in
    };

    
    const userStore = {
      token: token,
      userAuth: userAuth,
      userFromDB: userDataFromDB,
    };
    

    // Convert userStore object to JSON string before encrypting
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(userStore), // Convert to string
      process.env.NEXT_PUBLIC__SECRET_KEY
    ).toString();

    console.log(JSON.stringify(userStore));
    // Store the encrypted data in localStorage
    localStorage.setItem("AIzaSyDsz5edn22pVbHW", encryptedData);

    return { message: "Logged in successfully", user: userAuth };
  } catch (error) {
    console.error(error); // Add console error logging to debug

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

    // Get the encrypted user data from localStorage
    const encryptedUserData = localStorage.getItem("AIzaSyDsz5edn22pVbHW");

    if (encryptedUserData) {
      // Decrypt the user data
      const decryptedUserData = CryptoJS.AES.decrypt(
        encryptedUserData,
        process.env.NEXT_PUBLIC__SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);

      const userData = {
        ...JSON.parse(decryptedUserData),
        userAuth : {
          username: "",
          email: "",
          userType: "",
          isAuthenticated: false, // User logged out
        }
      };

      // Encrypt the updated user data and store it back in localStorage
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(userData),
        process.env.NEXT_PUBLIC__SECRET_KEY
      ).toString();

      console.log(JSON.stringify(userData));
      localStorage.setItem("hasSeenWelcome", JSON.stringify(false));
      localStorage.setItem("AIzaSyDsz5edn22pVbHW", encryptedData);
    }


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

// Sample user data structure
const users = [
  {
    id: 1,
    name: "Alice",
    cleanliness: 4,
    noiseTolerance: 3,
    bedtime: "Late",
    socialPreference: 2,
    interests: ["music", "movies"],
    budgetRange: { min: 500, max: 800 },
    smoking: false,
    drinking: true,
  },
  {
    id: 2,
    name: "Bob",
    cleanliness: 5,
    noiseTolerance: 4,
    bedtime: "Moderate",
    socialPreference: 3,
    interests: ["sports", "music"],
    budgetRange: { min: 600, max: 850 },
    smoking: false,
    drinking: true,
  },
  // Add more users as needed
];

// Calculate compatibility score function
function calculateCompatibilityScore(user1, user2) {
  let score = 0;

  // Cleanliness Match
  score += 5 - Math.abs(user1.cleanliness - user2.cleanliness);

  // Noise Tolerance Match
  score += 5 - Math.abs(user1.noiseTolerance - user2.noiseTolerance);

  // Bedtime Match
  if (user1.bedtime === user2.bedtime) {
    score += 5;
  } else {
    score += 3; // Partial match for close bedtimes
  }

  // Social Preferences Match
  score += 5 - Math.abs(user1.socialPreference - user2.socialPreference);

  // Shared Interests
  const sharedInterests = user1.interests.filter((interest) =>
    user2.interests.includes(interest)
  );
  score += sharedInterests.length * 2; // Each shared interest adds points

  // Budget Match
  const budgetOverlap =
    Math.min(user1.budgetRange.max, user2.budgetRange.max) -
    Math.max(user1.budgetRange.min, user2.budgetRange.min);
  if (budgetOverlap > 0) score += 5;

  // Smoking and Drinking Compatibility
  if (user1.smoking === user2.smoking) score += 5;
  if (user1.drinking === user2.drinking) score += 5;

  return score;
}

// API handler
export const compatibilyCheck = (userId: string) => {
  const currentUser = users.find((user) => user.id === parseInt(userId));
  if (!currentUser) {
    return { message: "User not found" };
  }

  const matches = users
    .filter((user) => user.id !== currentUser.id) // Exclude current user
    .map((user) => ({
      user,
      score: calculateCompatibilityScore(currentUser, user),
    }))
    .filter((match) => match.score > 20) // Minimum threshold for compatibility
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, 3); // Top 3 matches

  return { message: "Your match", matches };
};

// Fetch user data API call
export const getUserData = async (token) => {
  try {
    const response = await axios.get("/api/user");

    return response;
  } catch (error) {
    throw {
      message: "Error fetching user data",
      statusCode: 500,
    };
  }
};

// GET - Fetch all bookmarks
export const fetchBookmarks = async () => {
  try {
    const response = await axios.get("/api/bookmarks");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bookmarks:", error);
    throw error;
  }
};

// DELETE - Delete a bookmark by ID
export const deleteBookmark = async (bookmarkId) => {
  try {
    const response = await axios.delete(`/api/bookmarks/${bookmarkId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete bookmark:", error);
    throw error;
  }
};

// POST - Add a new student
export const addStudent = async (student) => {
  try {
    const response = await axios.post("/api/students", student);
    return response.data;
  } catch (error) {
    console.error("Failed to add student:", error);
    throw error;
  }
};

// GET - Fetch all students
export const fetchStudents = async () => {
  try {
    const response = await axios.get("/api/students");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw error;
  }
};

// DELETE - Delete a student by ID
export const deleteStudent = async (studentId) => {
  try {
    const response = await axios.delete(`/api/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete student:", error);
    throw error;
  }
};

// POST - Add a new agent
export const addAgent = async (agent) => {
  try {
    const response = await axios.post("/api/agents", agent);
    return response.data;
  } catch (error) {
    console.error("Failed to add agent:", error);
    throw error;
  }
};

// GET - Fetch all agents
export const fetchAgents = async () => {
  try {
    const response = await axios.get("/api/agents");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch agents:", error);
    throw error;
  }
};

// DELETE - Delete an agent by ID
export const deleteAgent = async (agentId) => {
  try {
    const response = await axios.delete(`/api/agents/${agentId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete agent:", error);
    throw error;
  }
};

// POST - Add a new property
export const addProperty = async (property) => {
  try {
    const response = await axios.post("/api/properties", property);
    return response.data;
  } catch (error) {
    console.error("Failed to add property:", error);
    throw error;
  }
};

// GET - Fetch all properties
export const fetchProperties = async () => {
  try {
    const response = await axios.get("/api/properties");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    throw error;
  }
};

// DELETE - Delete a property by ID
export const deleteProperty = async (propertyId) => {
  try {
    const response = await axios.delete(`/api/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete property:", error);
    throw error;
  }
};

// POST - Add a new review
export const addReview = async (review) => {
  try {
    const response = await axios.post("/api/reviews", review);
    return response.data;
  } catch (error) {
    console.error("Failed to add review:", error);
    throw error;
  }
};

// GET - Fetch all reviews
export const fetchReviews = async () => {
  try {
    const response = await axios.get("/api/reviews");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    throw error;
  }
};

// DELETE - Delete a review by ID
export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(`/api/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete review:", error);
    throw error;
  }
};

// POST - Add a new comment
export const addComment = async (comment) => {
  try {
    const response = await axios.post("/api/comments", comment);
    return response.data;
  } catch (error) {
    console.error("Failed to add comment:", error);
    throw error;
  }
};

// GET - Fetch all comments
export const fetchComments = async () => {
  try {
    const response = await axios.get("/api/comments");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

// DELETE - Delete a comment by ID
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`/api/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete comment:", error);
    throw error;
  }
};

// Function to fetch analytics data
export const fetchAnalytics = async () => {
  try {
    const response = await axios.get(`/api/analytics`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    throw error;
  }
};
