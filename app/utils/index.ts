import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { ID, storage } from "../lib/appwriteClient";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths } from "date-fns";

export * from "./auth";
export * from "./messages";
export * from "./martketplace";
export * from "./properties";
export * from "./user";
export * from "./reviews";
export * from "./trends";
export * from "./notifications";

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

export const getRelativeTime = (date): string => {
  const now = new Date();
  const mins = differenceInMinutes(now, date);

  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} mins ago`;

  const hrs = differenceInHours(now, date);
  if (hrs === 1) return "1 hr ago";
  if (hrs < 24) return `${hrs} hrs ago`;

  const days = differenceInDays(now, date);
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;

  const months = differenceInMonths(now, date);
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
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
