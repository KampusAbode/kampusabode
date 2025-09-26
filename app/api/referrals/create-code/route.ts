import { NextRequest, NextResponse } from "next/server";
import { createReferralCode } from "../../../utils/referrals";
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
    
    // Check if user is admin (you might want to check a custom claim or user role)
    // For now, we'll assume the user is admin if they can access this endpoint
    const createdBy = decodedToken.uid;

    const body = await request.json();
    const {
      ownerId,
      ownerName,
      ownerEmail,
      description,
    } = body;

    // Validate required fields
    if (!ownerId || !ownerName || !ownerEmail) {
      return NextResponse.json(
        { error: "Missing required fields: ownerId, ownerName, ownerEmail" },
        { status: 400 }
      );
    }

    // Create referral code
    const referralCode = await createReferralCode(
      ownerId,
      ownerName,
      ownerEmail,
      createdBy,
      {
        description,
      }
    );

    return NextResponse.json({
      success: true,
      referralCode,
      message: "Referral code created successfully",
    });
  } catch (error) {
    console.error("Error creating referral code:", error);
    return NextResponse.json(
      { error: "Failed to create referral code" },
      { status: 500 }
    );
  }
}
