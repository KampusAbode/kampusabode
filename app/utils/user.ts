import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const db = getFirestore();

export const fetchUsersById = async (
  userId: string,
  userType: "student" | "agent" | null = null
) => {
  try {
    // Reference to the "users" collection
    const usersCollection = collection(db, "users");

    // Build the query
    let usersQuery;
    if (userType) {
      usersQuery = query(
        usersCollection,
        where("id", "==", userId),
      );
    } else {
      usersQuery = query(
        usersCollection,
      );
    }

    // Fetch the documents
    const querySnapshot = await getDocs(usersQuery);

    // Map through the documents and return their data
    const user = querySnapshot.docs.map((doc) => ({
      ...(doc.data() as object), // Spread the document data
    }));

    return user;
  } catch (error) {
    console.error("Error fetching users by property ID:", error);
    throw error;
  }
};

