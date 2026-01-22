import { NextRequest, NextResponse } from "next/server";
import {
  sendWelcomeEmail,
  sendPropertyInquiry,
  sendTeamNotification,
  sendBroadcastEmail,
} from "../../../lib/email/send-email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let result;

    switch (type) {
      case "welcome":
        result = await sendWelcomeEmail(data.recipients, data.userName);
        break;
      case "property-inquiry":
        result = await sendPropertyInquiry(data.agentEmail, data);
        break;
      case "team-notification":
        result = await sendTeamNotification(
          data.subject,
          data.content,
          data.metadata
        );
        break;
      case "broadcast":
        result = await sendBroadcastEmail(
          data.recipients,
          data.subject,
          data.content,
          data.recipientNames
        );
        break;
      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
