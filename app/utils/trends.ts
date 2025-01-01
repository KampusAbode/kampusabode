// import axios from "axios";
import { TrendType } from "../fetch/types";
import { db } from "../lib/firebaseConfig";

import {
  collection,
  query,
  addDoc,
  onSnapshot,
  orderBy,
  where,
  getDocs,
} from "firebase/firestore";

export const allTrends = (callback: any) => {
  const trendRef = query(collection(db, "trends"), orderBy("timestamp", "asc"));
  // Real-time listener
  const unsubscribe = onSnapshot(trendRef, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(items);
  });

  // Return the unsubscribe function to clean up the listener when no longer needed
  return unsubscribe;
};

export const fetchTrendsByIDs = async (trendsIds: string[]) => {
  try {
    const trendsCollection = collection(db, "Trends");

    // Create a query using the "in" operator to fetch trends with IDs in the propertyIds array
    const trendsQuery = query(trendsCollection, where("id", "in", trendsIds));

    const querySnapshot = await getDocs(trendsQuery);

    // Map the documents to PropertyType
    const trendsList: TrendType[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as TrendType;

      return {
        id: data.id || "",
        image: data.image || "",
        title: data.title || "",
        description: data.description || "",
        author: data.author || "",
        category: data.category || "",
        published_date: data.published_date || "",
      };
    });

    return trendsList;
  } catch (error) {
    throw {
      message: (error as Error).message || "Error fetching trends by IDs",
      statusCode: 500,
    };
  }
};
