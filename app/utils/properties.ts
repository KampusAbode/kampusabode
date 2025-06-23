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
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { ApartmentType } from "../fetch/types";
import { ID, storage } from "../lib/appwriteClient";


  export const listApartment = async (data: any) => {
    try {
      // Step 1: Get a new document reference with generated UID
      const docRef = doc(collection(db, "properties")); // creates a ref without writing

      // Step 2: Create the final data with id and url
      const apartmentWithId: ApartmentType = {
        ...data,
        id: docRef.id,
        url: `/apartment/${docRef.id}`,
      };

      // Step 3: Write the full data (including id & url) using setDoc
      await setDoc(docRef, apartmentWithId);

      // Step 4: Return an object
      return {
        success: "apartment has been upload successfully",
        id: apartmentWithId.id,
        url: apartmentWithId.url,
      };
    } catch (error) {
      throw new Error((error as Error).message || "Failed to list apartment");
    }
  };

  export const uploadApartmentImagesToAppwrite = async (
    files: File[] | null,
    bucketId: string
  ): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const uniqueID = ID.unique();
          const response = await storage.createFile(bucketId, uniqueID, file);

          return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${response.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`;
        })
      );

      return urls;
    } catch (error) {
      console.error("Error uploading images: ", error);
      return [];
    }
  };

  export const getAllProperties = async (): Promise<ApartmentType[]> => {
    try {
      const q = query(collection(db, "properties"));
      const snap = await getDocs(q);
      return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ApartmentType[];
    } catch (error) {
      throw new Error((error as Error).message || "Failed to fetch properties");
    }
  };

  export const getApartmentById = async (
    id: string
  ): Promise<ApartmentType | null> => {
    try {
      const docRef = doc(db, "properties", id);
      const snap = await getDoc(docRef);
      return snap.exists()
        ? ({ id: snap.id, ...snap.data() } as ApartmentType)
        : null;
    } catch (error) {
      throw new Error((error as Error).message || "Failed to fetch apartment");
    }
  };

  export const getApartmentsByIds = async (
    ids: string[]
  ): Promise<ApartmentType[]> => {
    try {
      const apartmentPromises = ids.map(async (id) => {
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as ApartmentType;
        }
        return null;
      });

      const results = await Promise.all(apartmentPromises);
      return results.filter(
        (apartment): apartment is ApartmentType => apartment !== null
      );
    } catch (error) {
      console.error("Error fetching properties by IDs:", error);
      throw error;
    }
  };

  export const getPropertiesByAgent = async (
    agentId: string
  ): Promise<ApartmentType[]> => {
    try {
      const q = query(
        collection(db, "properties"),
        where("listedBy", "==", agentId)
      );
      const snap = await getDocs(q);
      return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ApartmentType[];
    } catch (error) {
      throw new Error(
        (error as Error).message || "Failed to fetch agent properties"
      );
    }
  };

  export const deleteApartment = async (apartmentId: string) => {
    try {
      const apartmentRef = doc(db, "properties", apartmentId);
      const apartmentSnap = await getDoc(apartmentRef);

      if (!apartmentSnap.exists()) {
        throw new Error("apartment not found.");
      }

      const apartmentData = apartmentSnap.data();
      const imageIds: string[] = apartmentData.images;

      // 1. Delete all images from Appwrite
      if (Array.isArray(imageIds) && imageIds.length > 0) {
        await Promise.all(
          imageIds.map((imageId) => deleteAppwriteImage(imageId))
        );
      }

      // 2. Delete the apartment document from Firestore
      await deleteDoc(apartmentRef);

      // 3. Remove apartmentId from the agent's properties array
      const userRef = doc(db, "users", apartmentData.agentId);
      await updateDoc(userRef, {
        userInfo: { propertiesListed: arrayRemove(apartmentId) },
      });

      return { success: true, message: "apartment has been deleted." };
    } catch (error) {
      console.error("Error deleting apartment:", error);
      throw {
        message: (error as Error).message || "Failed to delete apartment.",
        statusCode: 500,
      };
    }
  };

  export const deleteAppwriteImage = async (imageUrl: string) => {
    try {
      const fileId = extractAppwriteFileId(imageUrl);
      if (!fileId) throw new Error("File ID extraction failed.");

      await storage.deleteFile(
        process.env.NEXT_PUBLIC_APPWRITE_apartment_BUCKET_ID!,
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

   
  
  export const updateapartment = async (
    apartmentId: string,
    updates: Partial<ApartmentType>
  ) => {
    try {
      const docRef = doc(db, "properties", apartmentId);
      await updateDoc(docRef, updates);
      return { success: true };
    } catch (error) {
      throw new Error((error as Error).message || "Failed to update apartment");
    }
  };

  export const fetchPropertiesRealtime = (
    callback: (properties: ApartmentType[]) => void
  ) => {
    try {
      const q = query(
        collection(db, "properties"),
        where("approved", "==", true),
        orderBy("createdAt", "desc"),
      );
      return onSnapshot(q, (snapshot) => {
        const properties = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ApartmentType[];
        callback(properties);
      });
    } catch (error) {
      console.error("Error in realtime fetch:", error);
    }
  };

  // Toggle apartment approval
  export const toggleApartmentApproval = async (
    apartmentId: string,
    currentStatus: boolean
  ) => {
    try {
      const updatedStatus = !currentStatus;
      const docRef = doc(db, "properties", apartmentId);
      await updateDoc(docRef, { approved: updatedStatus });
      return { success: true, message: "apartment approval status updated." };
    } catch (error) {
      console.error("Error toggling apartment approval:", error);
      throw new Error(
        (error as Error).message || "Failed to update approval status."
      );
    }
  };

// export default {
//     listApartment,
//     getAllProperties,
//     getApartmentById,
//     getApartmentsByIds,
//     getPropertiesByAgent,
//     deleteApartment,
//     updateapartment,
//     fetchPropertiesRealtime,
//     toggleApartmentApproval,
//     deleteAppwriteImage,
//     uploadApartmentImagesToAppwrite,
//   };
