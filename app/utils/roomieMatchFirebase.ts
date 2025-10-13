// utils/roomieMatchFirebase.ts

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  increment,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig"; // Your Firebase config
import { RoomieMatchProfile, RoomieMatchFilters } from "../fetch/types";

const COLLECTION_NAME = "roomieMatchProfiles";

/**
 * Create a new RoomieMatch profile
 */
export const createRoomieProfile = async (
  profileData: Omit<RoomieMatchProfile, "id" | "views" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const docRef = doc(collection(db, COLLECTION_NAME));
    
    const newProfile: RoomieMatchProfile = {
      ...profileData,
      id: docRef.id,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(docRef, newProfile);

    console.log("RoomieMatch profile created:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error creating RoomieMatch profile:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get a user's RoomieMatch profile by userId
 */
export const getUserRoomieProfile = async (
  userId: string
): Promise<RoomieMatchProfile | null> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    // Return the first profile (should only be one per user)
    return querySnapshot.docs[0].data() as RoomieMatchProfile;
  } catch (error) {
    console.error("Error fetching user RoomieMatch profile:", error);
    return null;
  }
};

/**
 * Get a specific profile by document ID
 */
export const getRoomieProfileById = async (
  profileId: string
): Promise<RoomieMatchProfile | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, profileId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as RoomieMatchProfile;
  } catch (error) {
    console.error("Error fetching RoomieMatch profile by ID:", error);
    return null;
  }
};

/**
 * Update an existing RoomieMatch profile
 */
export const updateRoomieProfile = async (
  profileId: string,
  updates: Partial<RoomieMatchProfile>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, profileId);
    
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    console.log("RoomieMatch profile updated:", profileId);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating RoomieMatch profile:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Toggle profile visibility
 */
export const toggleProfileVisibility = async (
  profileId: string,
  isVisible: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, profileId);
    
    await updateDoc(docRef, {
      isVisible,
      updatedAt: new Date().toISOString(),
    });

    console.log("Profile visibility toggled:", profileId, isVisible);
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling profile visibility:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Mark profile as found/inactive
 */
export const updateProfileStatus = async (
  profileId: string,
  status: "active" | "found" | "inactive"
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, profileId);
    
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });

    console.log("Profile status updated:", profileId, status);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating profile status:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Increment profile view count
 */
export const incrementProfileViews = async (
  profileId: string
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, profileId);
    await updateDoc(docRef, {
      views: increment(1),
    });
  } catch (error) {
    console.error("Error incrementing profile views:", error);
  }
};

/**
 * Get all visible RoomieMatch profiles with filters
 */
export const getRoomieProfiles = async (
  filters?: RoomieMatchFilters
): Promise<RoomieMatchProfile[]> => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where("isVisible", "==", true),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );

    // Apply filters if provided
    if (filters) {
      if (filters.gender) {
        q = query(q, where("gender", "==", filters.gender));
      }
      if (filters.university) {
        q = query(q, where("university", "==", filters.university));
      }
      if (filters.locations && filters.locations.length > 0) {
        // Note: Firestore array-contains only works with single value
        // For multiple locations, we'll filter in memory
      }
    }

    const querySnapshot = await getDocs(q);
    let profiles = querySnapshot.docs.map((doc) => doc.data() as RoomieMatchProfile);

    // Apply client-side filters
    if (filters) {
      if (filters.locations && filters.locations.length > 0) {
        profiles = profiles.filter((profile) =>
          profile.preferredLocations.some((loc) =>
            filters.locations?.includes(loc)
          )
        );
      }

      if (filters.budgetMin !== undefined) {
        profiles = profiles.filter(
          (profile) => profile.budgetMax >= filters.budgetMin!
        );
      }

      if (filters.budgetMax !== undefined) {
        profiles = profiles.filter(
          (profile) => profile.budgetMin <= filters.budgetMax!
        );
      }

      if (filters.sleepSchedule) {
        profiles = profiles.filter(
          (profile) =>
            profile.sleepSchedule === filters.sleepSchedule ||
            profile.sleepSchedule === "flexible"
        );
      }

      if (filters.cleanlinessLevel) {
        profiles = profiles.filter(
          (profile) =>
            Math.abs(profile.cleanlinessLevel - filters.cleanlinessLevel!) <= 1
        );
      }

      if (filters.noisePreference) {
        profiles = profiles.filter(
          (profile) =>
            profile.noisePreference === filters.noisePreference ||
            profile.noisePreference === "moderate"
        );
      }
    }

    return profiles;
  } catch (error) {
    console.error("Error fetching RoomieMatch profiles:", error);
    return [];
  }
};

/**
 * Delete a RoomieMatch profile
 */
export const deleteRoomieProfile = async (
  profileId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, profileId);
    await updateDoc(docRef, {
      status: "inactive",
      isVisible: false,
      updatedAt: new Date().toISOString(),
    });

    console.log("RoomieMatch profile deleted (marked inactive):", profileId);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting RoomieMatch profile:", error);
    return { success: false, error: error.message };
  }
};