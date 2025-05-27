"use server";

import { log } from "console";
import nodemailer from "nodemailer";
import twilio from "twilio";

interface EmailPayload {
  apartmentId: string;
  apartmentTitle: string;
  agentEmail: string;
  agentNumber: string;
  agencyName: string;

  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  note?: string;
}

export async function sendInspectionEmail(payload: EmailPayload): Promise<{
  success: boolean;
  message: string;
  error?: string;
  twilioMessageId?: string;
}> {
  const {
    apartmentTitle,
    name,
    email,
    phone,
    preferredDate,
    preferredTime,
    agentEmail,
    agentNumber,
    agencyName,
    note,
  } = payload;
  function formatToWhatsApp(number: string): string {
    const trimmed = number.trim().replace(/\s+/g, "");
    if (trimmed.startsWith("+")) return `whatsapp:${trimmed}`;
    if (trimmed.startsWith("0")) return `whatsapp:+234${trimmed.slice(1)}`;
    return `whatsapp:+234${trimmed}`; // fallback
  }
  try {
    const twilioClient = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    if (!twilioClient) {
      throw new Error("Twilio client initialization failed");
    }

    const data = {
      from: "whatsapp:+19788006838",
      to: formatToWhatsApp('07012105995'),
      //   to: `whatsapp:${+1247050721686}`,
      body: `Hello ${
        agencyName || "Agent"
      }, ${name} has requested an inspection for ${apartmentTitle} on ${preferredDate} at ${preferredTime}. Contact: ${phone}. Note: ${
        note || "No additional notes"
      }`,
    };

    const res = await twilioClient.messages.create(data);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_GMAIL_USER,
        pass: process.env.MY_GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MY_GMAIL_USER,
      to: agentEmail,
      subject: "New Apartment Inspection Request",
      html: `
        <h3>New Inspection Request</h3>
        <p><strong>Apartment:</strong> ${apartmentTitle}</p>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate}</p>
        <p><strong>Preferred Time:</strong> ${preferredTime}</p>
      `,
    });

    return {
      success: true,
      message: "Email sent successfully",
      twilioMessageId: res.sid, // Optional: return Twilio message ID for tracking
    };
  } catch (error: any) {
    console.error("Email send failed:", error.message || error);
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
      error: error.message || "Unknown error",
    };
  }
}
