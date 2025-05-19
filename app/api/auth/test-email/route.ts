// app/api/test-email/route.js
import { sendTestEmail } from "@/lib/email/sendTestEmail";

export async function GET() {
  const result = await sendTestEmail();

  if (result.success) {
    return new Response(JSON.stringify({ messageId: result.messageId }), {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({ error: result.error || "Email failed" }),
      { status: 500 }
    );
  }
}
