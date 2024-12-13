//   app/utils/api.js

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
  CollectionReference,
  DocumentData,
  onSnapshot,
  orderBy,
  serverTimestamp,
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
        userAuth: {
          username: "",
          email: "",
          userType: "",
          isAuthenticated: false, // User logged out
        },
      };

      // Encrypt the updated user data and store it back in localStorage
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(userData),
        process.env.NEXT_PUBLIC__SECRET_KEY
      ).toString();

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

export const getProperties = async (): Promise<PropertyType[]> => {
  try {
    const propertiesCollection = collection(db, "properties");
    const snapshot = await getDocs(propertiesCollection);

    // Map each document to a PropertyType object
    const propertiesList: PropertyType[] = snapshot.docs.map((doc) => {
      const data = doc.data() as PropertyType;

      // Ensure the data returned from Firebase matches PropertyType
      const property: PropertyType = {
        id: data.id || null,
        url: data.url || "",
        agentId: data.agentId || 0,
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        location: data.location || "",
        neighborhood_overview: data.neighborhood_overview || "",
        type: data.type || "",
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        area: data.area || 0,
        amenities: data.amenities || [],
        images: data.images || [],
        saved: data.saved || false,
        available: data.available || false,
      };

      return property;
    });

    return propertiesList;
  } catch (error) {
    throw {
      message: (error as Error).message || "Error fetching properties",
      statusCode: 500,
    };
  }
};

export const addProperty = async (property: PropertyType): Promise<void> => {
  try {
    const propertiesCollection = collection(db, "properties");

    // Generate a unique ID for the property
    const newDocRef = doc(propertiesCollection);
    const uid = newDocRef.id;

    // Add the new property to the properties collection with the unique ID
    await addDoc(propertiesCollection, {
      id: uid,
      url: `/property/${uid}`,
      agentId: property.agentId,
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      neighborhood_overview: property.neighborhood_overview,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      amenities: property.amenities,
      images: property.images,
      saved: property.saved,
      available: property.available,
    });
  } catch (error) {
    throw {
      message: (error as Error).message || "Error adding property",
      statusCode: 500,
    };
  }
};

type Sender = {
  senderId: string;
  userName: string;
};
export const sendMessage = async (
  sender: Sender,
  receiverId: string,
  messageContent: string,
  isAdmin: boolean = false
) => {
  try {
    const { senderId, userName } = sender;
    const conversationId = isAdmin ? receiverId : senderId;

    // Message data
    const conversationData = {
      userName,
      senderId,
      receiverId,
      content: messageContent,
      timestamp: serverTimestamp(),
      status: "sent",
    };

    if (isAdmin) {
      // Add message to messages sub-collection
      const messagesRef = collection(
        db,
        `conversations/${conversationId}/messages`
      );
      await addDoc(messagesRef, conversationData);
    } else {
      // Update conversation metadata
      const conversationRef = doc(db, `conversations/${conversationId}`);
      await setDoc(conversationRef, conversationData);

      // Add message to messages sub-collection
      const messagesRef = collection(
        db,
        `conversations/${conversationId}/messages`
      );
      await addDoc(messagesRef, conversationData);
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending message:", error);
    throw {
      message: error.message || "Failed to send the message.",
      statusCode: 500,
    };
  }
};

export const getAllConversations = (callback) => {

  const conversationsRef = collection(db, "conversations");

  // Real-time listener
  const unsubscribe = onSnapshot(conversationsRef, (snapshot) => {
    const conversations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(conversations);
  });

  // Return the unsubscribe function to clean up the listener when no longer needed
  return unsubscribe;
};

export const getMessagesForConversation = async (conversationId) => {
  const messagesRef = collection(
    db,
    `conversations/${conversationId}/messages`
  );
  const snapshot = await getDocs(messagesRef);
  const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return messages;
};

export const listenToMessagesForConversation = (conversationId, callback) => {
  const messagesRef = collection(
    db,
    `conversations/${conversationId}/messages`
  );

  // Real-time listener
  const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });

  // Return the unsubscribe function to clean up the listener when no longer needed
  return unsubscribe;
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

export const updateAllProperties = async () => {
  try {
    // Reference to the 'properties' collection
    const propertiesCollection = collection(db, "properties");

    // Fetch all documents in the 'properties' collection
    const snapshot = await getDocs(propertiesCollection);

    // Loop through each document to update it
    snapshot.forEach(async (doc) => {
      const docRef = doc.ref;

      // Update the document to add or modify fields
      await updateDoc(docRef, {
        // Example: Adding a new field 'agentLocation'
        agentLocation: "City Center", // Change this value as needed

        // Example: Removing the 'location' field
        location: deleteField(),
      });
    });

    console.log("All properties updated successfully!");
  } catch (error) {
    console.error("Error updating properties:", error);
  }
};
