import { NextRequest, NextResponse } from "next/server";
import { getReferralStats } from "../../../utils/referrals";
import { initFirebaseAdmin } from "../../../lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export async function GET(request: NextRequest) {
  try {
    // Initialize Firebase Admin
    initFirebaseAdmin();
    const auth = getAuth();

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

    // Get referral statistics
    const stats = await getReferralStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch referral statistics" },
      { status: 500 }
    );
  }
}
