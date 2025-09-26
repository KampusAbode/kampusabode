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
  limit,
  Timestamp,
  addDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { ReferralCode, ReferralRecord, ReferralStats } from "../fetch/types";

// Generate a unique referral code
export const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a new referral code for a user
export const createReferralCode = async (
  ownerId: string,
  ownerName: string,
  ownerEmail: string,
  createdBy: string,
  options?: {
    description?: string;
  }
): Promise<ReferralCode> => {
  try {
    // Generate unique code
    let code = generateReferralCode();
    let isUnique = false;
    let attempts = 0;
    
    // Ensure code is unique
    while (!isUnique && attempts < 10) {
      const existingCode = await getReferralCodeByCode(code);
      if (!existingCode) {
        isUnique = true;
      } else {
        code = generateReferralCode();
        attempts++;
      }
    }
    
    if (!isUnique) {
      throw new Error("Unable to generate unique referral code");
    }

    const referralCodeData: Omit<ReferralCode, 'id'> = {
      code,
      ownerId,
      ownerName,
      ownerEmail,
      createdAt: Timestamp.now(),
      isActive: true,
      usageCount: 0,
      description: options?.description,
      createdBy,
    };

    const docRef = await addDoc(collection(db, "referralCodes"), referralCodeData);
    
    return {
      id: docRef.id,
      ...referralCodeData,
    };
  } catch (error) {
    console.error("Error creating referral code:", error);
    throw new Error("Failed to create referral code");
  }
};

// Get referral code by code string
export const getReferralCodeByCode = async (code: string): Promise<ReferralCode | null> => {
  try {
    const q = query(collection(db, "referralCodes"), where("code", "==", code));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as ReferralCode;
  } catch (error) {
    console.error("Error fetching referral code:", error);
    throw new Error("Failed to fetch referral code");
  }
};

// Get all referral codes for a specific user
export const getUserReferralCodes = async (ownerId: string): Promise<ReferralCode[]> => {
  try {
    const q = query(
      collection(db, "referralCodes"),
      where("ownerId", "==", ownerId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ReferralCode[];
  } catch (error) {
    console.error("Error fetching user referral codes:", error);
    throw new Error("Failed to fetch user referral codes");
  }
};

// Get all referral codes (admin function)
export const getAllReferralCodes = async (): Promise<ReferralCode[]> => {
  try {
    const q = query(collection(db, "referralCodes"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ReferralCode[];
  } catch (error) {
    console.error("Error fetching all referral codes:", error);
    throw new Error("Failed to fetch referral codes");
  }
};

// Update referral code usage count
export const updateReferralCodeUsage = async (codeId: string): Promise<void> => {
  try {
    const codeRef = doc(db, "referralCodes", codeId);
    await updateDoc(codeRef, {
      usageCount: increment(1),
    });
  } catch (error) {
    console.error("Error updating referral code usage:", error);
    throw new Error("Failed to update referral code usage");
  }
};

// Create a referral record when someone signs up with a code
export const createReferralRecord = async (
  referralCodeId: string,
  referralCode: string,
  referrerId: string,
  referrerName: string,
  referredUserId: string,
  referredUserName: string,
  referredUserEmail: string
): Promise<ReferralRecord> => {
  try {
    const referralRecordData: Omit<ReferralRecord, 'id'> = {
      referralCodeId,
      referralCode,
      referrerId,
      referrerName,
      referredUserId,
      referredUserName,
      referredUserEmail,
      signupDate: Timestamp.now(),
      status: 'completed',
    };

    const docRef = await addDoc(collection(db, "referralRecords"), referralRecordData);
    
    // Update the referral code usage count
    await updateReferralCodeUsage(referralCodeId);
    
    return {
      id: docRef.id,
      ...referralRecordData,
    };
  } catch (error) {
    console.error("Error creating referral record:", error);
    throw new Error("Failed to create referral record");
  }
};

// Get referral records for a specific referrer
export const getReferralRecordsByReferrer = async (referrerId: string): Promise<ReferralRecord[]> => {
  try {
    const q = query(
      collection(db, "referralRecords"),
      where("referrerId", "==", referrerId),
      orderBy("signupDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ReferralRecord[];
  } catch (error) {
    console.error("Error fetching referral records:", error);
    throw new Error("Failed to fetch referral records");
  }
};

// Get all referral records (admin function)
export const getAllReferralRecords = async (): Promise<ReferralRecord[]> => {
  try {
    const q = query(collection(db, "referralRecords"), orderBy("signupDate", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ReferralRecord[];
  } catch (error) {
    console.error("Error fetching all referral records:", error);
    throw new Error("Failed to fetch referral records");
  }
};

// Get referral statistics
export const getReferralStats = async (): Promise<ReferralStats> => {
  try {
    const [codesSnapshot, recordsSnapshot] = await Promise.all([
      getDocs(collection(db, "referralCodes")),
      getDocs(collection(db, "referralRecords"))
    ]);

    const totalCodesGenerated = codesSnapshot.size;
    const totalSignups = recordsSnapshot.size;
    
    // Count active codes
    const activeCodes = codesSnapshot.docs.filter(doc => 
      doc.data().isActive && 
      (!doc.data().expiresAt || doc.data().expiresAt.toDate() > new Date())
    ).length;

    // Calculate conversion rate
    const conversionRate = totalCodesGenerated > 0 ? (totalSignups / totalCodesGenerated) * 100 : 0;

    // Get top referrers
    const referrerCounts: { [key: string]: { userName: string; count: number } } = {};
    
    recordsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const referrerId = data.referrerId;
      const referrerName = data.referrerName;
      
      if (!referrerCounts[referrerId]) {
        referrerCounts[referrerId] = { userName: referrerName, count: 0 };
      }
      referrerCounts[referrerId].count++;
    });

    const topReferrers = Object.entries(referrerCounts)
      .map(([userId, data]) => ({
        userId,
        userName: data.userName,
        referralCount: data.count,
      }))
      .sort((a, b) => b.referralCount - a.referralCount)
      .slice(0, 10);

    return {
      totalCodesGenerated,
      totalSignups,
      activeCodes,
      conversionRate,
      topReferrers,
    };
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    throw new Error("Failed to fetch referral statistics");
  }
};

// Validate referral code
export const validateReferralCode = async (code: string): Promise<{
  isValid: boolean;
  referralCode?: ReferralCode;
  error?: string;
}> => {
  try {
    const referralCode = await getReferralCodeByCode(code);
    
    if (!referralCode) {
      return { isValid: false, error: "Referral code not found" };
    }
    
    if (!referralCode.isActive) {
      return { isValid: false, error: "Referral code is inactive" };
    }
    
    return { isValid: true, referralCode };
  } catch (error) {
    console.error("Error validating referral code:", error);
    return { isValid: false, error: "Failed to validate referral code" };
  }
};

// Deactivate referral code
export const deactivateReferralCode = async (codeId: string): Promise<void> => {
  try {
    const codeRef = doc(db, "referralCodes", codeId);
    await updateDoc(codeRef, {
      isActive: false,
    });
  } catch (error) {
    console.error("Error deactivating referral code:", error);
    throw new Error("Failed to deactivate referral code");
  }
};

// Update referral record status
export const updateReferralRecordStatus = async (
  recordId: string,
  status: 'pending' | 'completed' | 'verified',
  notes?: string
): Promise<void> => {
  try {
    const recordRef = doc(db, "referralRecords", recordId);
    const updateData: any = { status };
    
    if (notes) {
      updateData.notes = notes;
    }
    
    await updateDoc(recordRef, updateData);
  } catch (error) {
    console.error("Error updating referral record status:", error);
    throw new Error("Failed to update referral record status");
  }
};
