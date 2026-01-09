import { resend, FROM_EMAIL, TEAM_EMAIL } from "./Resend";
import { WelcomeEmail } from "./templates/welcome";
import { PropertyInquiryEmail } from "./templates/property-inquiry";
import { TeamNotificationEmail } from './templates/team-notification';
import { CustomBroadcastEmail } from "./templates/custom-broadcast";

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: "Welcome to Kampus Abode!",
      react: WelcomeEmail({ userName }),
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error };
  }
}

export async function sendPropertyInquiry(
  agentEmail: string,
  data: {
    userName: string;
    userEmail: string;
    propertyTitle: string;
    message: string;
  }
) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: agentEmail,
      subject: `New Inquiry for ${data.propertyTitle}`,
      react: PropertyInquiryEmail(data),
    });

    if (error) {
      console.error("Error sending property inquiry email:", error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error("Failed to send property inquiry email:", error);
    return { success: false, error };
  }
}

export async function sendTeamNotification(
  subject: string,
  content: string,
  metadata?: Record<string, any>
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TEAM_EMAIL,
      subject: `[Kampus Abode] ${subject}`,
      react: TeamNotificationEmail({ subject, content, metadata }),
    });

    if (error) {
      console.error("Error sending team notification:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send team notification:", error);
    return { success: false, error };
  }
}


export async function sendBroadcastEmail(
  recipients: string[],
  subject: string,
  content: string,
  recipientNames?: Record<string, string>
) {
  try {
    const results = await Promise.allSettled(
      recipients.map(async (email) => {
        const { data, error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject,
          react: CustomBroadcastEmail({
            subject,
            content,
            recipientName: recipientNames?.[email],
          }),
        });

        if (error) {
          console.error(`Error sending to ${email}:`, error);
          return { email, success: false, error };
        }

        return { email, success: true, data };
      })
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return {
      success: true,
      results: {
        total: recipients.length,
        successful,
        failed,
        details: results,
      },
    };
  } catch (error) {
    console.error("Failed to send broadcast emails:", error);
    return { success: false, error };
  }
}
