import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const db = getFirestore();

export const fetchReviewsByPropertyId = async (propertyId) => {
  try {
    // Reference to the "reviews" collection
    const reviewsCollection = collection(db, "Reviews");

    // Query to fetch reviews where "propertyId" matches
    const reviewsQuery = query(
      reviewsCollection,
      where("propertyId", "==", propertyId)
    );

    // Fetch the documents
    const querySnapshot = await getDocs(reviewsQuery);

    // Map through the documents and return their data
    const reviews = querySnapshot.docs.map((doc) => ({
      ...doc.data(), // Spread the document data
    }));

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews for property:", error);
    throw error;
  }
};


export const fetchReviewsByAuthor = async (userId) => {
  try {
    // Reference to the "reviews" collection
    const reviewsCollection = collection(db, "reviews");

    // Query to fetch reviews where "authorId" matches
    const reviewsQuery = query(
      reviewsCollection,
      where("author", "==", userId)
    );

    // Fetch the documents
    const querySnapshot = await getDocs(reviewsQuery);

    // Map through the documents and return their data
    const reviews = querySnapshot.docs.map((doc) => ({
      ...doc.data(), // Spread the document data
    }));

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews by author:", error);
    throw error;
  }
};


export const fetchReviewsByAgentId = async (agentId) => {
  try {
    // Reference to the "reviews" collection
    const reviewsCollection = collection(db, "reviews");

    // Query to fetch reviews where "authorId" matches
    const reviewsQuery = query(
      reviewsCollection,
      where("agentId", "==", agentId)
    );

    // Fetch the documents
    const querySnapshot = await getDocs(reviewsQuery);

    // Map through the documents and return their data
    const reviews = querySnapshot.docs.map((doc) => ({
      ...doc.data(), // Spread the document data
    }));

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews by author:", error);
    throw error;
  }
};
