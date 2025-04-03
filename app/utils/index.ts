import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { ID, storage } from "../lib/appwriteClient";

export * from "./auth";
export * from "./messages";
export * from "./martketplace";
export * from "./properties";
export * from "./user";
export * from "./reviews";
export * from "./trends";

//ACTIONS

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "m";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num.toString();
  }
};

interface UpdateLikesInput {
  id: string;
  action: "like" | "unlike";
}

export const updateLikes = async ({ id, action }: UpdateLikesInput) => {
  if (!id || !action) {
    throw new Error("Missing id or action");
  }

  const trendRef = doc(db, "trends", id);

  try {
    if (action === "like") {
      await updateDoc(trendRef, {
        likes: increment(1),
      });
    } else if (action === "unlike") {
      await updateDoc(trendRef, {
        likes: increment(-1),
      });
    } else {
      throw new Error("Invalid action");
    }

    return { message: "Success" };
  } catch (error) {
    console.error("Error updating likes: ", error);
    throw new Error("Internal server error");
  }
};

export const uploadImageToAppwrite = async (
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

export const uploadImagesToAppwrite = async (
  files: File[],
  bucketId: string
): Promise<string[]> => {
  if (!files.length) return [];

  try {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const uniqueID = ID.unique();
        const response = await storage.createFile(bucketId, uniqueID, file);

        return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${response.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`;
      })
    );

    return uploadedFiles;
  } catch (error) {
    console.error("Error uploading images: ", error);
    return [];
  }
};
