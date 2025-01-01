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



// Trends data
export const trends = [
  {
    title: "10 Tips for First-Time Homebuyers",
    description:
      "Are you thinking of buying your first home? In this blog post, we share 10 essential tips to help first-time homebuyers navigate the real estate market and make informed decisions. From understanding your budget to navigating the mortgage process, we cover everything you need to know to achieve your homeownership goals.",
    author: "Emily Johnson",
    image: "/assets/build1.jpg",
    published_date: "2024-05-01",
    category: "Home Buying",
  },
  {
    title: "The Benefits of Investing in Real Estate",
    description:
      "Interested in real estate investing? Discover the numerous benefits of investing in real estate in this informative blog post. From generating passive income to building wealth over time, real estate offers unique advantages that can help you achieve financial freedom and security.",
    author: "John Smith",
    image: "/assets/build2.jpg",
    published_date: "2024-04-15",
    category: "Real Estate Investment",
  },
  {
    title: "Top Interior Design Trends for 2024",
    description:
      "Stay ahead of the curve with our guide to the top interior design trends for 2024. From bold colors to sustainable materials, we explore the latest trends shaping the world of interior design. Whether you're renovating your home or looking for inspiration, this blog post has you covered.",
    author: "Sophia Wilson",
    image: "/assets/l3.jpg",
    published_date: "2024-03-28",
    category: "Interior Design",
  },
  {
    title: "Navigating the Rental Market: Tips for Tenants",
    description:
      "Renting a property? Learn how to navigate the rental market like a pro with our expert tips for tenants. From understanding lease agreements to negotiating rent prices, we share valuable advice to help renters find their ideal rental property and ensure a smooth renting experience.",
    author: "Michael Brown",
    image: "/assets/build4.jpg",
    published_date: "2024-03-10",
    category: "Rental Market",
  },
  {
    title: "The Importance of Location in Real Estate",
    description:
      "Location, location, location – discover why location matters in real estate and how it can impact property values and investment potential. In this blog post, we explore the factors that make a location desirable and share insights to help buyers and investors make informed decisions.",
    author: "Olivia Johnson",
    image: "/assets/l6.jpg",
    published_date: "2024-02-22",
    category: "Real Estate Market",
  },
];

export const uploadTrends = async () => {
  try {
    const trendsCollection = collection(db, "trends");

    for (const trend of trends) {
      await addDoc(trendsCollection, trend);
      console.log(`Uploaded: ${trend.title}`);
    }

    console.log("All trends uploaded successfully!");
  } catch (error) {
    console.error("Error uploading trends:", error.message);
  }
};

// Call the function to upload trends
uploadTrends();
