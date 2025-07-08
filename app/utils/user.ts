import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  collection,
  getCountFromServer,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { UserType } from "../fetch/types";
import { db } from "../lib/firebaseConfig";

export const fetchAllUsers = async (): Promise<UserType[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: UserType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as UserType),
    }));

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export const fetchAnalytics = async () => {
  try {
    const usersRef = collection(db, "users");
    const propertiesRef = collection(db, "properties");

    // Fetch total users & properties count
    const [usersSnapshot, propertiesSnapshot] = await Promise.all([
      getCountFromServer(usersRef),
      getCountFromServer(propertiesRef),
    ]);

    // Query users collection to count agents & students separately
    const agentsQuery = query(usersRef, where("userType", "==", "agent"));
    const studentsQuery = query(usersRef, where("userType", "==", "student"));

    const [agentsSnapshot, studentsSnapshot] = await Promise.all([
      getDocs(agentsQuery),
      getDocs(studentsQuery),
    ]);

    return {
      totalUsers: usersSnapshot.data().count,
      totalProperties: propertiesSnapshot.data().count,
      totalAgents: agentsSnapshot.size, // Count number of agent users
      totalStudents: studentsSnapshot.size, // Count number of student users
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw new Error("Failed to fetch analytics data");
  }
};

export const togglePropertyApproval = async (
  propertyId: string,
  newStatus: boolean
) => {
  try {
    const propertyRef = doc(db, "properties", propertyId);

    await updateDoc(propertyRef, {
      approved: newStatus,
    });
  } catch (error) {
    console.error("Error updating property appoved:", error);
    throw new Error("Failed to update property appoved.");
  }
};

// Fetch all reviews from Firestore
export const fetchReviews = async () => {
  try {
    const reviewsRef = collection(db, "reviews");
    const snapshot = await getDocs(reviewsRef);

    // Transform Firestore documents into a structured array
    const reviews = snapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the rest of the document data
    }));

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    throw new Error("Failed to fetch reviews");
  }
};

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

    return { success: true, message: "profile created successfully!" };
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
      userData: updatedDoc.data() as UserType,
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

export async function assignUserRole(
  username: string,
  userId: string,
  role: "admin" | "writer",
  assignedBy: string
) {
  const userRoleRef = doc(db, "userRoles", userId);
  const roleData = {
    username,
    userId,
    role,
    assignedBy,
    assignedAt: Timestamp.now(),
  };

  try {
    // Upsert the role
    await setDoc(userRoleRef, roleData, { merge: true });

    console.log(`Assigned role '${role}' to user ${userId}`);
  } catch (error) {
    console.error("Error assigning user role:", error);
    throw error;
  }
}


export const getUserRole = async (
  userId: string
): Promise<"admin" | "writer" | "user"> => {
  try {
    if (!userId) {
      return "user";
    }
    const rolesRef = collection(db, "userRoles");
    const q = query(rolesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return "user"; // default fallback
    }

    // Assuming one document per userId:
    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return data.role === "admin" || data.role === "writer" ? data.role : "user";
  } catch (err) {
    console.error("Error fetching user role:", err);
    return "user";
  }
};

export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  const role = await getUserRole(userId);
  return role === "admin";
};

export const checkIsWriter = async (userId: string): Promise<boolean> => {
  const role = await getUserRole(userId);
  return role === "admin" || role === "writer"; // admin inherits writer permissions
};
