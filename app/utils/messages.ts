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
    const messageId = role === "admin" ? receiverId : senderId;

    // Message data
    const conversationData = {
      userName,
      senderId,
      receiverId,
      content: messageContent,
      timestamp: serverTimestamp(),
      read: false,
    };

    if (role === "admin") {
      // Add message to messages sub-collection
      const messagesRef = collection(
        db,
        `messages/${messageId}/messages`
      );
      await addDoc(messagesRef, conversationData);
    } else if (role === "user") {
      // Update conversation metadata
      const conversationRef = doc(db, `messages/${messageId}`);
      await setDoc(conversationRef, conversationData);

      // Add message to messages sub-collection
      const messagesRef = collection(
        db,
        `messages/${messageId}/messages`
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



// this function deletes the message (as requested by the users) from the database
export const deleteMessageFromFirebase = async (userId: string, messageId: string) => {
  const messageRef = doc(db, `messages/${userId}/messages/${messageId}`);
  await deleteDoc(messageRef);
};



// this function gets all the messages (as requested by the users) from the "messages" collection database
export const getAllMessages = (callback) => {
  const messagesRef = collection(db, "messages");

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



// this function listen to messages from conversation for any chances (real time listen)
export const listenToMessagesForConversation = (messageId: string, callback) => {
  const messagesRef = collection(
    db,
    `messages/${messageId}/messages`
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
