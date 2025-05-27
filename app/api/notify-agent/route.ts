import { sendInspectionEmail } from "../../utils/sendInspectionEmail";


export async function POST(req: Request) {
  const data = await req.json();

  const emailSent = await sendInspectionEmail(data);

  if (emailSent) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
    });
  }
}
