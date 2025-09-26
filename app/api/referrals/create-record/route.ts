import { NextRequest, NextResponse } from "next/server";
import { createReferralRecord } from "../../../utils/referrals";
import { initFirebaseAdmin } from "../../../lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export async function POST(request: NextRequest) {
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
    const decodedToken = await auth.verifyIdToken(token);

    const body = await request.json();
    const {
      referralCodeId,
      referralCode,
      referrerId,
      referrerName,
      referredUserId,
      referredUserName,
      referredUserEmail,
    } = body;

    // Validate required fields
    if (!referralCodeId || !referralCode || !referrerId || !referrerName || 
        !referredUserId || !referredUserName || !referredUserEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create referral record
    const referralRecord = await createReferralRecord(
      referralCodeId,
      referralCode,
      referrerId,
      referrerName,
      referredUserId,
      referredUserName,
      referredUserEmail
    );

    return NextResponse.json({
      success: true,
      referralRecord,
      message: "Referral record created successfully",
    });
  } catch (error) {
    console.error("Error creating referral record:", error);
    return NextResponse.json(
      { error: "Failed to create referral record" },
      { status: 500 }
    );
  }
}
