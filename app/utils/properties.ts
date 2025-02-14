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
} from "firebase/firestore";

// import CryptoJS from "crypto-js";
import { PropertyType } from "../fetch/types";

export const fetchProperties = async (): Promise<PropertyType[]> => {
  try {
    const propertiesCollection = collection(db, "properties");
    const snapshot = await getDocs(propertiesCollection);

    // Map each document to a PropertyType object
    const propertiesList: PropertyType[] = snapshot.docs.map((doc) => {
      const data = doc.data() as PropertyType;

      // Ensure the data returned from Firebase matches PropertyType
      const property: PropertyType = {
        id: data.id || null,
        url: data.url || "",
        agentId: data.agentId || null,
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        location: data.location || "",
        neighborhood_overview: data.neighborhood_overview || "",
        type: data.type || "",
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        area: data.area || 0,
        amenities: data.amenities || [],
        images: data.images || [],
        available: data.available || false,
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
        price: data.price || "",
        location: data.location || "",
        neighborhood_overview: data.neighborhood_overview || "",
        type: data.type || "",
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        area: data.area || 0,
        amenities: data.amenities || [],
        images: data.images || [],
        available: data.available || false,
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


export const fetchPropertiesByIds = async (propertyIds: string[]): Promise<PropertyType[]> => {
  try {
    const propertiesCollection = collection(db, "properties");

    // Create a query using the "in" operator to fetch properties with IDs in the propertyIds array
    const propertiesQuery = query(
      propertiesCollection,
      where("id", "in", propertyIds)
    );

    const querySnapshot = await getDocs(propertiesQuery);

    // Map the documents to PropertyType
    const propertiesList: PropertyType[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as PropertyType;
      return {
        id: data.id || null,
        url: data.url || "",
        agentId: data.agentId || null,
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        location: data.location || "",
        neighborhood_overview: data.neighborhood_overview || "",
        type: data.type || "",
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        area: data.area || 0,
        amenities: data.amenities || [],
        images: data.images || [],
        available: data.available || false,
      };
    });

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
    await addDoc(propertiesCollection, {
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
    });

    return {success: "uploaded apartment successfully", url: propertyUrl};
  } catch (error) {
    throw {
      message: (error as Error).message || "Failed to upload Apartment",
      statusCode: 500,
    };
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
