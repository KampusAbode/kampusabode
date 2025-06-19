// import axios from "axios";
import { TrendType } from "../fetch/types";
import { db } from "../lib/firebaseConfig";

import {
  collection,
  query,
  addDoc,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";

export const allTrends = (callback: any) => {
  const trendRef = query(collection(db, "trends"), orderBy("published_date", "asc"));
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

export const fetchTrendByID = async (trendId: string) => {
  try {
    // Reference a specific document using `doc` for better precision
    const trendDocRef = doc(db, "trends", trendId);

    // Fetch the document
    const trendDoc = await getDoc(trendDocRef);

    if (!trendDoc.exists()) {
      // Throw a custom error if the document doesn't exist
      throw new Error("No trend found with the provided ID");
    }

    
    return {
      slug: trendDoc.data().slug,
      id: trendDoc.data().id,
      title: trendDoc.data().title,
      content: trendDoc.data().content,
      author: trendDoc.data().author,
      image: trendDoc.data().image,
      published_date: trendDoc.data().published_date,
      category: trendDoc.data().category,
    };
  } catch (error) {
    // Handle and throw errors with a unified structure
    throw {
      message: (error as Error).message || "Error fetching trend by ID",
      statusCode:
        error instanceof Error && error.message.includes("No trend found")
          ? 404
          : 500,
    };
  }
};



export const fetchTrendBySlug = async (trendSlug: string) => {
  try {
    // Reference a specific document using `doc` for better precision
    const trendDocRef = doc(db, "trends");

    const trendQuery = query(
      trendDocRef,
      where("slug", "==", trendSlug),
      orderBy("createdAt", "desc") // optional
    );
    
    // Fetch the document
    const trendDoc = await getDoc(trendQuery);

    if (!trendDoc.exists()) {
      // Throw a custom error if the document doesn't exist
      throw new Error("No trend found with the provided ID");
    }

    
    return {
      slug: trendDoc.data().slug,
      id: trendDoc.data().id,
      title: trendDoc.data().title,
      content: trendDoc.data().content,
      author: trendDoc.data().author,
      image: trendDoc.data().image,
      published_date: trendDoc.data().published_date,
      category: trendDoc.data().category,
    };
  } catch (error) {
    // Handle and throw errors with a unified structure
    throw {
      message: (error as Error).message || "Error fetching trend by ID",
      statusCode:
        error instanceof Error && error.message.includes("No trend found")
          ? 404
          : 500,
    };
  }
};



// async function removeDuplicateDocuments(collectionName: string, filterBy: string) {
//   try {
//     const snapshot = await getDocs(collection(db, collectionName));

//     if (snapshot.empty) {
//       console.log("No documents found.");
//       return;
//     }

//     const titlesMap = new Map(); // To track unique titles
//     const duplicates = []; // To store duplicate document IDs

//     // Identify duplicates
//     snapshot.forEach((doc) => {
//       const data = doc.data();
//       if (titlesMap.has(data[filterBy])) {
//         duplicates.push(doc.id); // Duplicate found
//       } else {
//         titlesMap.set(data[filterBy], true); // Add title to the map
//       }
//     });

//     console.log(`Found ${duplicates.length} duplicate documents.`);

//     // Delete duplicates
//     for (const docId of duplicates) {
//       await deleteDoc(doc(db, collectionName, docId));
//       console.log(`Deleted document with ID: ${docId}`);
//     }

//     console.log("Duplicate removal complete.");
//   } catch (error) {
//     console.error("Error removing duplicates:", error);
//   }
// }

// Usage
// removeDuplicateDocuments("trends", "filterBy");
