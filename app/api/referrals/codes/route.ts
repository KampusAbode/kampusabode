import { NextRequest, NextResponse } from "next/server";
import { getAllReferralCodes } from "../../../utils/referrals";
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

    // Get all referral codes
    const codes = await getAllReferralCodes();

    return NextResponse.json({
      success: true,
      codes,
    });
  } catch (error) {
    console.error("Error fetching referral codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch referral codes" },
      { status: 500 }
    );
  }
}
