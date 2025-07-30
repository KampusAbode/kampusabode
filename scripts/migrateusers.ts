import admin, { ServiceAccount } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../serviceAccountKey.json"; // Adjust the path if needed

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}

const db = getFirestore();

interface LegacyUser {
  name?: string;
  avatar?: string;
  email?: string;
  phoneNumber?: string;
  university?: string;
  bio?: string;
  createdAt?: string;
  department?: string;
  currentYear?: number;
  savedProperties?: string[];
  viewedProperties?: string[];
  wishlist?: string[];
  agencyName?: string;
  propertiesListed?: string[];
  userInfo?: any; // legacy might have this or might not
  userType?: string; // legacy might not have this yet
}

interface StudentUserInfo {
  department: string;
  currentYear: number;
  savedProperties: string[];
  viewedProperties: string[];
  wishlist: string[];
}

interface AgentUserInfo {
  agencyName: string;
  propertiesListed: string[];
  propertiesSold?: string[];
  reviews?: string[];
  ratings?: number;
}

interface NewUser {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phoneNumber: string;
  university: string;
  bio: string;
  createdAt: string;
  userType: "student" | "agent";
  userInfo: StudentUserInfo | AgentUserInfo;
}

export async function migrateUsers(): Promise<{
  migratedCount: number;
  migratedUserIds: string[];
  failedUserIds: { id: string; reason: string }[];
}> {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.limit(2).get(); // test only 2 users
  const batch = db.batch();

  let migratedCount = 0;
  const migratedUserIds: string[] = [];
  const failedUserIds: { id: string; reason: string }[] = [];

  snapshot.forEach(async (doc) => {
    const user = doc.data() as LegacyUser;
    const userId = doc.id;

    try {
      const isStudent = user.userType === "student" || !!user.department;

      const newUser: NewUser = {
        id: userId,
        name: user.name || "",
        avatar: user.avatar || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        university: user.university || "",
        bio: user.bio || "",
        createdAt: user.createdAt || new Date().toISOString(),
        userType: isStudent ? "student" : "agent",
        userInfo: isStudent
          ? {
              department: user.userInfo?.department || user.department || "",
              currentYear: user.userInfo?.currentYear || user.currentYear || 1,
              savedProperties:
                user.userInfo?.savedProperties || user.savedProperties || [],
              viewedProperties:
                user.userInfo?.viewedProperties || user.viewedProperties || [],
              wishlist: user.userInfo?.wishlist || user.wishlist || [],
            }
          : {
              agencyName: user.userInfo?.agencyName || user.agencyName || "",
              propertiesListed:
                user.userInfo?.propertiesListed || user.propertiesListed || [],
              propertiesSold: user.userInfo?.propertiesSold || [],
              reviews: user.userInfo?.reviews || [],
              ratings: user.userInfo?.ratings || 0,
            },
      };

      await db
        .collection("migrations")
        .doc(`backup_${userId}`)
        .set({ user, backedUpAt: new Date().toISOString() });

      // Add to Firestore batch
      batch.set(usersRef.doc(userId), newUser, { merge: true });

      migratedUserIds.push(userId);

      await db.collection("migrations").doc(`migration_log_${userId}`).set({
        userId,
        status: "migrated",
        migratedAt: new Date().toISOString(),
      });

      migratedCount++;
    } catch (error: any) {
      console.error(`❌ Failed to migrate user ${userId}:`, error.message);
      failedUserIds.push({ id: userId, reason: error.message });
    }
  });

  if (migratedCount > 0) {
    await batch.commit();
  } else {
  }

  return { migratedCount, migratedUserIds, failedUserIds };
}

if (require.main === module) {
  migrateUsers()
    .then((result) => {})
    .catch((err) => {
      console.error("❌ Migration failed:", err);
    });
}
export default migrateUsers;
