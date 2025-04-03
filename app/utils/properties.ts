// import axios from "axios";
import { db, auth } from "../lib/firebaseConfig";

import {
  collection,
  doc,
  updateDoc,
  getDocs,
  deleteField,
  addDoc,
  getDoc,
  query,
  where,
  setDoc,
  deleteDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";

// import CryptoJS from "crypto-js";
import { PropertyType } from "../fetch/types";
import { storage } from "../lib/appwriteClient";

export const fetchPropertiesRealtime = (
  callback: (properties: PropertyType[]) => void
) => {
  try {
    const approvedQuery = query(
      collection(db, "properties"),
      where("approved", "==", true)
    );

    // Subscribe to Firestore changes
    const unsubscribe = onSnapshot(approvedQuery, (snapshot) => {
      const properties: PropertyType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PropertyType[];

      callback(properties); // Pass data to callback function
    });

    return unsubscribe; // Return function to stop listening when needed
  } catch (error) {
    console.error("Error fetching properties in real-time:", error);
  }
};

export const fetchAllPropertiesWithoutQuery = async (): Promise<
  PropertyType[]
> => {
  try {
    const propertiesCollection = collection(db, "properties");

    const snapshot = await getDocs(propertiesCollection);

    // Map each document to a PropertyType object
    const propertiesList: PropertyType[] = snapshot.docs.map((doc) => {
      const data = doc.data() as PropertyType;

      // Ensure the data returned from Firebase matches PropertyType
      const property: PropertyType = {
        id: doc.id, // Use Firestore document ID
        url: data.url || "",
        agentId: data.agentId || null,
        title: data.title || "",
        description: data.description || "",
        price: data.price || 0,
        location: data.location || "",
        neighborhood_overview: data.neighborhood_overview || "",
        type: data.type || "",
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        area: data.area || 0,
        amenities: data.amenities || [],
        images: data.images || [],
        available: data.available || false,
        approved: data.approved || false, // Should always be true
      };

      return property;
    });

    return propertiesList;
  } catch (error) {
    throw {
      message: (error as Error).message || "Error fetching properties",
      statusCode: 500,
    };
  }
};

export const fetchPropertyById = async (
  propertyId: string
): Promise<PropertyType | null> => {
  try {
    // Reference to the "properties" collection
    const propertyDocRef = doc(db, "properties", propertyId);

    // Fetch the document
    const propertyDoc = await getDoc(propertyDocRef);

    // If the document exists, return the property data
    if (propertyDoc.exists()) {
      const data = propertyDoc.data() as PropertyType;

      // Ensure the data returned from Firebase matches PropertyType
      const property: PropertyType = {
        id: data.id || null,
        url: data.url || "",
        agentId: data.agentId || null,
        title: data.title || "",
        description: data.description || "",
        price: data.price || 0,
        location: data.location || "",
        neighborhood_overview: data.neighborhood_overview || "",
        type: data.type || "",
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        area: data.area || 0,
        amenities: data.amenities || [],
        images: data.images || [],
        available: data.available || false,
        approved: false,
      };
      return property;
    } else {
      console.log(propertyId, "No such property!");
      return null; // Return null if the property doesn't exist
    }
  } catch (error) {
    console.error("Error fetching property:", error);
    throw {
      message: (error as Error).message || "Error fetching property",
      statusCode: 500,
    };
  }
};

export const fetchPropertiesByIds = async (
  propertyIds: string[]
): Promise<PropertyType[]> => {
  try {
    const propertiesCollection = collection(db, "properties");

    // Create a query using the "in" operator to fetch properties with IDs in the propertyIds array
    const propertiesQuery = query(
      propertiesCollection,
      where("id", "in", propertyIds)
    );

    const querySnapshot = await getDocs(propertiesQuery);

    // Map the documents to PropertyType
    const propertiesList: PropertyType[] = querySnapshot.docs
      .map((doc) => {
        const data = doc.data() as PropertyType;
        return {
          id: data.id || null,
          url: data.url || "",
          agentId: data.agentId || null,
          title: data.title || "",
          description: data.description || "",
          price: data.price || 0,
          location: data.location || "",
          neighborhood_overview: data.neighborhood_overview || "",
          type: data.type || "",
          bedrooms: data.bedrooms || 0,
          bathrooms: data.bathrooms || 0,
          area: data.area || 0,
          amenities: data.amenities || [],
          images: data.images || [],
          available: data.available || false,
          approved: data.approved || false,
        };
      })
      .filter((property) => property.approved === true);

    return propertiesList;
  } catch (error) {
    console.error("Error fetching properties by IDs using 'in' query:", error);
    throw {
      message: (error as Error).message || "Error fetching properties by IDs",
      statusCode: 500,
    };
  }
};

export const addProperty = async (property) => {
  try {
    const propertiesCollection = collection(db, "properties");

    // Generate a unique ID for the property
    const newDocRef = doc(propertiesCollection);
    const uid = newDocRef.id;
    const propertyUrl = `/properties/${uid}`;

    // Add the new property to the properties collection with the unique ID
    await setDoc(newDocRef, {
      id: uid,
      url: propertyUrl,
      agentId: property.agentId,
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      neighborhood_overview: property.neighborhood_overview,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      amenities: property.amenities,
      images: property.images,
      available: property.available,
      approved: false,
    });

    // Reference to the agent user document
    const agentDocRef = doc(db, "users", property.agentId);

    // Update the agent's `propertiesListed` array with the new property ID
    await updateDoc(agentDocRef, {
      "userInfo.propertiesListed": arrayUnion(uid), // Adds the property ID to the array
    });

    return {
      success: "uploaded apartment successfully",
      url: propertyUrl,
      propertyId: uid,
    };
  } catch (error) {
    throw {
      message: (error as Error).message || "Failed to upload Apartment",
      statusCode: 500,
    };
  }
};

export const deleteProperty = async (
  propertyId: string,
  imageUrls: string[]
) => {
  try {
    // 1. Delete the property from Firebase Firestore
    const propertyRef = doc(db, "properties", propertyId);
    await deleteDoc(propertyRef);

    // 2. Delete associated images from Appwrite
    await Promise.all(imageUrls.map((url) => deleteAppwriteImage(url)));

    return {
      success: true,
      message: "Property and images deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting property:", error);
    return { success: false, message: "Failed to delete property." };
  }
};

export const deleteAppwriteImage = async (imageUrl: string) => {
  try {
    const fileId = extractAppwriteFileId(imageUrl);
    if (!fileId) throw new Error("File ID extraction failed.");

    await storage.deleteFile(
      process.env.NEXT_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID!,
      fileId
    );

    return { success: true, message: "Image deleted successfully." };
  } catch (error) {
    console.error("Failed to delete image from Appwrite:", error);
    return { success: false, message: "Failed to delete image." };
  }
};

// Function to extract Appwrite File ID from URL
export const extractAppwriteFileId = (imageUrl: string) => {
  try {
    const match = imageUrl.match(/\/files\/(.*?)\/view/);
    if (match && match[1]) {
      return match[1]; // Extract the file ID
    }
    throw new Error("Invalid Appwrite file URL format");
  } catch (error) {
    throw new Error("Failed to extract Appwrite file ID");
  }
};

export const updateAllProperties = async () => {
  try {
    // Reference to the 'properties' collection
    const propertiesCollection = collection(db, "properties");

    // Fetch all documents in the 'properties' collection
    const snapshot = await getDocs(propertiesCollection);

    // Loop through each document to update it
    snapshot.forEach(async (doc) => {
      const docRef = doc.ref;

      // Update the document to add or modify fields
      await updateDoc(docRef, {
        // Example: Adding a new field 'agentLocation'
        agentLocation: "City Center", // Change this value as needed

        // Example: Removing the 'location' field
        location: deleteField(),
      });
    });

    console.log("All properties updated successfully!");
  } catch (error) {
    console.error("Error updating properties:", error);
  }
};
