// /scripts/migrateUsers.ts or a private Next.js API route

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";



if (!getApps().length) {
  initializeApp({
    credential: cert(process.env.FIREBASE_ADMIN_SDK_JSON),
  });
}

const db = getFirestore();

async function migrateUsers() {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();

  if (snapshot.empty) {
  
    return;
  }

  const batch = db.batch();

  snapshot.forEach((doc) => {
    const user = doc.data();
    const userId = doc.id;

    // Skip if already migrated
    if (user.userInfo && user.userType) {
   
      return;
    }

    const isStudent = !!user.department;
    const newUser = {
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
            department: user.department || "",
            currentYear: user.currentYear || 1,
            savedProperties: user.savedProperties || [],
            viewedProperties: user.viewedProperties || [],
            wishlist: user.wishlist || [],
          }
        : {
            agencyName: user.userInfo.agencyName || "",
              propertiesListed: user.propertiesListed || [],
              propertiesSold: user.propertiesSold || [],
              reviews: user.reviews || [],
              ratings: user.ratings || 0,

          },
    };

    batch.update(usersRef.doc(userId), newUser);
  
  });

  await batch.commit();
 
}

migrateUsers().catch((err) => {
  console.error("Migration failed:", err);
});
