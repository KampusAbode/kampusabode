
import { db } from "../lib/firebaseConfig";
import {CommentType} from "../fetch/types";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp,
  orderBy,
  collectionGroup,
  doc,
  setDoc,
} from "firebase/firestore";

// ----------------------
// Get comments under a specific trend
// ----------------------
export async function getCommentsByTrendId(trendId: string) {
  try {
    const commentsRef = collection(db, "trends", trendId, "comments");
    const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(commentsQuery);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

// ----------------------
// Get all comments made by a specific user across all trends
// ----------------------
export async function getUserComments(userId: string) {
  try {
    const userCommentsQuery = query(
      collectionGroup(db, "comments"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(userCommentsQuery);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return [];
  }
}



// ----------------------
// Send a new comment to a specific trend
export async function sendUserComment(
  newComment: CommentType
) {
  try {
    if (!newComment.trendId) {
      throw new Error("Invalid trend ID.");
    }

    // Reference to the comments collection
    const commentsCollection = collection(
      db,
      "trends",
      newComment.trendId,
      "comments"
    );

    // Generate a new document reference (with a manual ID)
    const newCommentRef = doc(commentsCollection); // Generates a random unique ID

    const commentWithMeta: CommentType = {
      ...newComment,
      id: newCommentRef.id
    };

    // Save the comment using the generated ID
    await setDoc(newCommentRef, commentWithMeta);

    return newCommentRef.id;
  } catch (error) {
    console.error("Error sending comment:", error);
    throw error;
  }
}

