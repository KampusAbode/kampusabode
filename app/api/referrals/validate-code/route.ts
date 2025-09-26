import { NextRequest, NextResponse } from "next/server";
import { validateReferralCode } from "../../../utils/referrals";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Referral code is required" },
        { status: 400 }
      );
    }

    const validation = await validateReferralCode(code);

    return NextResponse.json({
      success: true,
      ...validation,
    });
  } catch (error) {
    console.error("Error validating referral code:", error);
    return NextResponse.json(
      { error: "Failed to validate referral code" },
      { status: 500 }
    );
  }
}
