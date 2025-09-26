import { NextRequest, NextResponse } from "next/server";
import { initFirebaseAdmin } from "../../../lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  try {
    // Initialize Firebase Admin
    initFirebaseAdmin();
    const auth = getAuth();
    const db = getFirestore();

    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify the token
    const token = authHeader.split("Bearer ")[1];
    await auth.verifyIdToken(token);

    // Get search query
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Search users collection for matching email
    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("email", ">=", email)
      .where("email", "<=", email + "\uf8ff")
      .limit(10)
      .get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
