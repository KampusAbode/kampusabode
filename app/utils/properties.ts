// import axios from "axios";
import { db, auth } from "../lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  deleteField,
  addDoc,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  orderBy,
} from "firebase/firestore";

import CryptoJS from "crypto-js";
import { PropertyType } from "../fetch/types";

export const getProperties = async (): Promise<PropertyType[]> => {
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
        agentId: data.agentId || 0,
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
        saved: data.saved || false,
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

export const addProperty = async (property: PropertyType): Promise<void> => {
  try {
    const propertiesCollection = collection(db, "properties");

    // Generate a unique ID for the property
    const newDocRef = doc(propertiesCollection);
    const uid = newDocRef.id;

    // Add the new property to the properties collection with the unique ID
    await addDoc(propertiesCollection, {
      id: uid,
      url: `/properties/${uid}`,
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
      saved: property.saved,
      available: property.available,
    });
  } catch (error) {
    throw {
      message: (error as Error).message || "Error adding property",
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
