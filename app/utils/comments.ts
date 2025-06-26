<<<<<<< HEAD


import { CommentType } from "../fetch/types";
=======
>>>>>>> 11620ee6100d85cea13e961ef08ae002424d91ee
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
<<<<<<< HEAD
=======
      id: doc.id,
>>>>>>> 11620ee6100d85cea13e961ef08ae002424d91ee
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return [];
  }
}

<<<<<<< HEAD
// ----------------------
// Comment data structure
=======
>>>>>>> 11620ee6100d85cea13e961ef08ae002424d91ee


// ----------------------
// Post a user comment under a specific trend
// ----------------------
export async function sendUserComment(
<<<<<<< HEAD
  newComment: CommentType,
  
=======
  newComment: Omit<CommentType, "createdAt">
>>>>>>> 11620ee6100d85cea13e961ef08ae002424d91ee
) {
  try {
    if (!newComment.trendId) {
      throw new Error("Invalid trend ID.");
    }

    const commentsCollection = collection(
      db,
      "trends",
      newComment.trendId,
      "comments"
    );

<<<<<<< HEAD
    const docRef = await addDoc(commentsCollection, newComment);
=======
    const commentWithTimestamp: CommentType = {
      ...newComment,
      createdAt: Timestamp.now().toDate(),
    };

    const docRef = await addDoc(commentsCollection, commentWithTimestamp);
>>>>>>> 11620ee6100d85cea13e961ef08ae002424d91ee
    return docRef.id;
  } catch (error) {
    console.error("Error sending comment:", error);
    throw error;
  }
}
