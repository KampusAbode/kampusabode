

import { CommentType } from "../fetch/types";
import { db } from "../lib/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp,
  orderBy,
  collectionGroup,
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
      orderBy("createdAt", "desc") // optional
    );

    const querySnapshot = await getDocs(userCommentsQuery);

    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return [];
  }
}

// ----------------------
// Comment data structure


// ----------------------
// Post a user comment under a specific trend
// ----------------------
export async function sendUserComment(
  newComment: CommentType,
  
) {
  try {
    const commentsCollection = collection(db, "trends", newComment.trendId, "comments");

    const docRef = await addDoc(commentsCollection, newComment);
    return docRef.id;
  } catch (error) {
    console.error("Error sending comment:", error);
    throw error;
  }
}
