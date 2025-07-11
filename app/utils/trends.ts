// import axios from "axios";
import { uploadImageToAppwrite } from ".";
import { TrendType } from "../fetch/types";
import { ID } from "../lib/appwriteClient";
import { db } from "../lib/firebaseConfig";

import {
  collection,
  query,
  where,
  addDoc,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

export const allTrends = (callback: any) => {
  const trendRef = query(
    collection(db, "trends"),
    orderBy("published_date", "desc")
  );
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
      likes: trendDoc.data().likes,
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
    const trendsRef = collection(db, "trends");
    const trendQuery = query(trendsRef, where("slug", "==", trendSlug));

    // Fetch the document
    const snapshot = await getDocs(trendQuery);

    if (snapshot.empty) {
      // Throw a custom error if the document doesn't exist
      throw new Error("No trend found with the provided ID");
    }

    const trendDoc = snapshot.docs[0];

    return {
      slug: trendDoc.data().slug,
      id: trendDoc.data().id,
      title: trendDoc.data().title,
      content: trendDoc.data().content,
      author: trendDoc.data().author,
      image: trendDoc.data().image,
      likes: trendDoc.data().likes,
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



export async function uploadTrend({
  title,
  content,
  category,
  image,
  author,
}: {
  title: string;
  content: string;
  category: string;
  image: File | string;
  author: string;
}): Promise<TrendType> {
  const trendRef = collection(db, "trends");

  // Generate slug
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  // Upload image to Appwrite
  let imageUrl: string;

  if (typeof image === "string") {
    imageUrl = image; // already uploaded URL
  } else {
    imageUrl = await uploadImageToAppwrite(
      image,
      process.env.NEXT_PUBLIC_APPWRITE_TREND_BUCKET_ID
    );
  }


  const newTrendId = ID.unique();
  const docRef = doc(trendRef, newTrendId);

  const trendData: TrendType = {
    id: newTrendId,
    slug,
    title,
    content,
    author,
    image: imageUrl,
    likes: 0,
    published_date: new Date().toISOString(),
    category,
  };

  await setDoc(docRef, trendData);
  return trendData;
}


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
