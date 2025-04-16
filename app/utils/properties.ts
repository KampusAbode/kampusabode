// hooks/useProperties.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  setDoc,
  deleteField,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { PropertyType } from "../fetch/types";
import { ID, storage } from "../lib/appwriteClient";

export const useProperties = () => {
  const listProperty = async (data: any) => {
    try {
      // Step 1: Get a new document reference with generated UID
      const docRef = doc(collection(db, "properties")); // creates a ref without writing

      // Step 2: Create the final data with id and url
      const propertyWithId: PropertyType = {
        ...data,
        id: docRef.id,
        url: `/properties/${docRef.id}`,
      };

      // Step 3: Write the full data (including id & url) using setDoc
      await setDoc(docRef, propertyWithId);

      // Step 4: Return an object
      return { success: "property has been upload successfully", id: propertyWithId.id,  url: propertyWithId.url};
    } catch (error) {
      throw new Error((error as Error).message || "Failed to list property");
    }
  };


  const uploadPropertyImagesToAppwrite = async (
    file: File | null,
    bucketId: string
  ): Promise<string> => {
    if (!file) return "";
    try {
      const uniqueID = ID.unique();
      const response = await storage.createFile(bucketId, uniqueID, file);
  
      return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${response.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`;
    } catch (error) {
      console.error("Error uploading image: ", error);
      return "";
    }
  };

  const getAllProperties = async (): Promise<PropertyType[]> => {
    try {
      const q = query(collection(db, "properties"));
      const snap = await getDocs(q);
      return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PropertyType[];
    } catch (error) {
      throw new Error((error as Error).message || "Failed to fetch properties");
    }
  };

  const getPropertyById = async (id: string): Promise<PropertyType | null> => {
    try {
      const docRef = doc(db, "properties", id);
      const snap = await getDoc(docRef);
      return snap.exists()
        ? ({ id: snap.id, ...snap.data() } as PropertyType)
        : null;
    } catch (error) {
      throw new Error((error as Error).message || "Failed to fetch property");
    }
  };

   const getPropertiesByIds = async (
     ids: string[]
   ): Promise<PropertyType[]> => {
     try {
       const propertyPromises = ids.map(async (id) => {
         const docRef = doc(db, "properties", id);
         const docSnap = await getDoc(docRef);
         if (docSnap.exists()) {
           return { id: docSnap.id, ...docSnap.data() } as PropertyType;
         }
         return null;
       });

       const results = await Promise.all(propertyPromises);
       return results.filter(
         (property): property is PropertyType => property !== null
       );
     } catch (error) {
       console.error("Error fetching properties by IDs:", error);
       throw error;
     }
   };

  const getPropertiesByAgent = async (
    agentId: string
  ): Promise<PropertyType[]> => {
    try {
      const q = query(
        collection(db, "properties"),
        where("listedBy", "==", agentId)
      );
      const snap = await getDocs(q);
      return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PropertyType[];
    } catch (error) {
      throw new Error(
        (error as Error).message || "Failed to fetch agent properties"
      );
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      const propertyRef = doc(db, "properties", propertyId);
      const propertySnap = await getDoc(propertyRef);

      if (!propertySnap.exists()) {
        throw new Error("Property not found.");
      }

      const propertyData = propertySnap.data();
      const imageId = propertyData.images;

      // 1. Delete the image from Appwrite
      if (imageId) {
        await deleteAppwriteImage(imageId);
      }

      // 2. Delete the property document from Firestore
      await deleteDoc(propertyRef);

      // 3. Remove propertyId from the agent's properties array
      const userRef = doc(db, "users", propertyData.agentId);
      await updateDoc(userRef, {
        userInfo: { propertiesListed: arrayRemove(propertyId) },
      });

      return { success: true, message: "property has been deleted" };
    } catch (error) {
      console.error("Error deleting property:", error);
      throw {
        message: (error as Error).message || "Failed to delete property.",
        statusCode: 500,
      };
    }
  };

  const deleteAppwriteImage = async (imageUrl: string) => {
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
  const extractAppwriteFileId = (imageUrl: string) => {
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

  const updateProperty = async (
    propertyId: string,
    updates: Partial<PropertyType>
  ) => {
    try {
      const docRef = doc(db, "properties", propertyId);
      await updateDoc(docRef, updates);
      return { success: true };
    } catch (error) {
      throw new Error((error as Error).message || "Failed to update property");
    }
  };

  const fetchPropertiesRealtime = (
    callback: (properties: PropertyType[]) => void
  ) => {
    try {
      const q = query(
        collection(db, "properties"),
        where("approved", "==", true)
      );
      return onSnapshot(q, (snapshot) => {
        const properties = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PropertyType[];
        callback(properties);
      });
    } catch (error) {
      console.error("Error in realtime fetch:", error);
    }
  };

  // Toggle property approval
  const togglePropertyApproval = async (
    propertyId: string,
    currentStatus: boolean
  ) => {
    try {
      const updatedStatus = !currentStatus;
      const docRef = doc(db, "properties", propertyId);
      await updateDoc(docRef, { approved: updatedStatus });
      return { success: true, message: "Property approval status updated." };
    } catch (error) {
      console.error("Error toggling property approval:", error);
      throw new Error(
        (error as Error).message || "Failed to update approval status."
      );
    }
  };

  return {
    listProperty,
    getAllProperties,
    getPropertyById,
    getPropertiesByIds,
    getPropertiesByAgent,
    deleteProperty,
    updateProperty,
    fetchPropertiesRealtime,
    togglePropertyApproval,
    deleteAppwriteImage,
    uploadPropertyImagesToAppwrite,
  };
};
