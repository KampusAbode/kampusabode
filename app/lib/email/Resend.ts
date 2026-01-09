import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "noreply@kampusabode.com";
export const TEAM_EMAIL =
  process.env.KAMPUS_ABODE_TEAM_EMAIL || "team@kampusabode.com";
