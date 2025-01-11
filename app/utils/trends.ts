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
  deleteDoc,
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
      id: trendDoc.data().id,
      title: trendDoc.data().title,
      description: trendDoc.data().descrition,
      author: trendDoc.data().author,
      image: trendDoc.data().image,
      published_date: trendDoc.data().published_date,
      likes: trendDoc.data().likes,
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



// // Trends data
// export const trends = [
//   {
//     title: "10 Tips for First-Time Homebuyers",
//     description:
//       "Are you thinking of buying your first home? In this blog post, we share 10 essential tips to help first-time homebuyers navigate the real estate market and make informed decisions. From understanding your budget to navigating the mortgage process, we cover everything you need to know to achieve your homeownership goals.",
//     author: "Emily Johnson",
//     image: "/assets/build1.jpg",
//     published_date: "2024-05-01",
//     category: "Home Buying",
//   },
//   {
//     title: "The Benefits of Investing in Real Estate",
//     description:
//       "Interested in real estate investing? Discover the numerous benefits of investing in real estate in this informative blog post. From generating passive income to building wealth over time, real estate offers unique advantages that can help you achieve financial freedom and security.",
//     author: "John Smith",
//     image: "/assets/build2.jpg",
//     published_date: "2024-04-15",
//     category: "Real Estate Investment",
//   },
//   {
//     title: "Top Interior Design Trends for 2024",
//     description:
//       "Stay ahead of the curve with our guide to the top interior design trends for 2024. From bold colors to sustainable materials, we explore the latest trends shaping the world of interior design. Whether you're renovating your home or looking for inspiration, this blog post has you covered.",
//     author: "Sophia Wilson",
//     image: "/assets/l3.jpg",
//     published_date: "2024-03-28",
//     category: "Interior Design",
//   },
//   {
//     title: "Navigating the Rental Market: Tips for Tenants",
//     description:
//       "Renting a property? Learn how to navigate the rental market like a pro with our expert tips for tenants. From understanding lease agreements to negotiating rent prices, we share valuable advice to help renters find their ideal rental property and ensure a smooth renting experience.",
//     author: "Michael Brown",
//     image: "/assets/build4.jpg",
//     published_date: "2024-03-10",
//     category: "Rental Market",
//   },
//   {
//     title: "The Importance of Location in Real Estate",
//     description:
//       "Location, location, location – discover why location matters in real estate and how it can impact property values and investment potential. In this blog post, we explore the factors that make a location desirable and share insights to help buyers and investors make informed decisions.",
//     author: "Olivia Johnson",
//     image: "/assets/l6.jpg",
//     published_date: "2024-02-22",
//     category: "Real Estate Market",
//   },
// ];

// export const uploadTrends = async () => {
//   try {
//     const trendsCollection = collection(db, "trends");

//     for (const trend of trends) {
//       await addDoc(trendsCollection, trend);
//       console.log(`Uploaded: ${trend.title}`);
//     }

//     console.log("All trends uploaded successfully!");
//   } catch (error) {
//     console.error("Error uploading trends:", error.message);
//   }
// };

// Call the function to upload trends
// uploadTrends();


async function removeDuplicateDocuments(collectionName: string, filterBy: string) {
  try {
    const snapshot = await getDocs(collection(db, collectionName));

    if (snapshot.empty) {
      console.log("No documents found.");
      return;
    }

    const titlesMap = new Map(); // To track unique titles
    const duplicates = []; // To store duplicate document IDs

    // Identify duplicates
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (titlesMap.has(data[filterBy])) {
        duplicates.push(doc.id); // Duplicate found
      } else {
        titlesMap.set(data[filterBy], true); // Add title to the map
      }
    });

    console.log(`Found ${duplicates.length} duplicate documents.`);

    // Delete duplicates
    for (const docId of duplicates) {
      await deleteDoc(doc(db, collectionName, docId));
      console.log(`Deleted document with ID: ${docId}`);
    }

    console.log("Duplicate removal complete.");
  } catch (error) {
    console.error("Error removing duplicates:", error);
  }
}

// Usage
// removeDuplicateDocuments("trends", "filterBy");
