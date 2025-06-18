// app/api/test-email/route.js
import { sendAndEmail } from "@/lib/email/sendAndEmail";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const result = await sendAndEmail(email);

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
