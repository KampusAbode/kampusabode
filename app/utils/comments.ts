

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
    const commentsQuery = query(commentsRef, orderBy("createdAt", "asc"));
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
      id: doc.id,
      trendId: doc.ref.parent.parent?.id ?? null,
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
type CommentType = {
  trendId: string;
  userId: string;
  userName: string;
  comment: string;
  userProfile: string;
  createdAt: Timestamp;
};

// ----------------------
// Post a user comment under a specific trend
// ----------------------
export async function sendUserComment(
  newComment: Omit<CommentType, "createdAt">,
  
) {
  try {
    const commentsCollection = collection(db, "trends", newComment.trendId, "comments");

    const commentWithTimestamp: CommentType = {
      ...newComment,
      
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(commentsCollection, commentWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error("Error sending comment:", error);
    throw error;
  }
}
