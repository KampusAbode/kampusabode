// import axios from "axios";
import { db } from "../lib/firebaseConfig";

import {
  collection,
  query,
  addDoc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

export const allMarketplaceItems = (callback: any) => {
  const itemsRef = query(
    collection(db, "Marketitems"),
    orderBy("timestamp", "asc")
  );
  // Real-time listener
  const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(items);
  });

  // Return the unsubscribe function to clean up the listener when no longer needed
  return unsubscribe;
};

type Item = {
  name: string;
  description: string;
  price: string;
  condition: string;
  imageUrl: string;
  sellerContact: {
    name: string;
    whatsappNumber: string;
  };
  category: string;
  timestamp: string;
};

export const updateMartketplaceItems = async (item: Item) => {
  const itemsRef = collection(db, "Marketitems");

  try {
    const itemData = {
      name: item.name,
      description: item.description,
      price: item.price,
      condition: item.condition,
      imageUrl: item.imageUrl,
      sellerContact: {
        name: item.sellerContact.name,
        whatsappNumber: item.sellerContact.whatsappNumber,
      },
      category: item.category,
      timestamp: new Date().toISOString(),
    };

    await addDoc(itemsRef, itemData);
    return { status: "success", message: "All Items added successfully" };
  } catch (error) {
    return { status: "error", message: "Error uploading marketplace items" };
  }
};
