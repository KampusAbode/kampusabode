// ...existing code...

import { db } from "../lib/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

// Function to collect comments data of a particular trend article using ID
export async function getCommentsByTrendId(trendId: string) {
  const commentsCollection = collection(db, "trendcomments");
  const q = query(commentsCollection, where("trendId", "==", trendId));
  const querySnapshot = await getDocs(q);
  const comments = querySnapshot.docs.map((doc) => doc.data());
  return comments;
}

type CommentType = {
  trendId: string;
  userName: string;
  comment: string;
  userProfile: string;
  createdAt: string;
};

// Function to send user comments
export async function sendUserComment(newComment: CommentType) {
  const commentsCollection = collection(db, "trendcomments");

  const docRef = await addDoc(commentsCollection, newComment);
  return docRef.id;
}

// ...existing code...
