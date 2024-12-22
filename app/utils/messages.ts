// import axios from "axios";
import { db } from "../lib/firebaseConfig";

import {
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";


type Sender = {
  senderId: string;
  userName: string;
  role: string;
};
export const sendMessage = async (
  sender: Sender,
  receiverId: string,
  messageContent: string
) => {
  try {
    const { senderId, userName, role } = sender;
    const conversationId = role === "admin" ? receiverId : senderId;

    // Message data
    const conversationData = {
      userName,
      senderId,
      receiverId,
      content: messageContent,
      timestamp: serverTimestamp(),
      status: "sent",
    };

    if (role === "admin") {
      // Add message to messages sub-collection
      const messagesRef = collection(
        db,
        `conversations/${conversationId}/messages`
      );
      await addDoc(messagesRef, conversationData);
    } else if (role === "user") {
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

export const deleteMessageFromFirebase = async (userId, messageId) => {
  const messageRef = doc(db, `conversations/${userId}/messages/${messageId}`);
  await deleteDoc(messageRef);
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
