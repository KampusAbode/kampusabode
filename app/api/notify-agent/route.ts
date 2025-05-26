import nodemailer from "nodemailer";
import toast from "react-hot-toast";
// import twilio from "twilio";

export async function POST(req) {
  const {
    name,
    email,
    phone,
    apartmentTitle,
    date,
    time,
    note,
    agentEmail,
    agentNumber,
    agentName,
  } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_GMAIL_USER,
      pass: process.env.MY_GMAIL_APP_PASSWORD, // Use app password
    },
  });

  const mailOptions = {
    from: process.env.MY_GMAIL_USER,
    to: agentEmail,
    subject: "New Apartment Inspection Request",
    html: `
      <h3>New Inspection Request</h3>
      <p><strong>Apartment:</strong> ${apartmentTitle}</p>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Preferred Date:</strong> ${date}</p>
      <p><strong>Preferred Time:</strong> ${time}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);

    // const twilioClient = twilio(
    //   process.env.TWILIO_SID,
    //   process.env.TWILIO_AUTH_TOKEN
    // );

    // await twilioClient.messages.create({
    //   from: "whatsapp:+14155238886", // Twilio sandbox number
    //   to: `whatsapp:${agentPhone}`, // agent's phone in E.164 format
    //   body: `Hello, ${name} has requested an inspection for ${apartmentTitle} on ${date} at ${time}. Contact: ${phone}`,
    // });

    const message = `Hello ${agentName}, I'm ${name} and I would like to schedule an apartment inspection.\n\n📞 Phone: ${phone}\n📅 Date: ${date}\n⏰ Time: ${time}\n📝 Note: ${
      note || "No additional notes"
    }\n\nPlease let me know if this works for you.`;

    // Open WhatsApp chat in a new tab with pre-filled message
    window.open(
      `https://wa.me/${agentNumber}?text=${encodeURIComponent(message)}`
    );

    toast.success("Redirecting to WhatsApp...");

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Email error:", err);
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
    });
  }
}
