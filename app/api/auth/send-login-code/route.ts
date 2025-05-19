import { NextResponse } from "next/server";
import { saveLoginCode } from "@/db/mongo";
import { sendCodeEmail } from "@/lib/email/sendCodeEmail";
import { hashCode } from "@/lib/codeUtils";
import { logAuthEvent } from "@/lib/auth/logAuthEvent";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000;
  const userCodeHash = hashCode(code);

  const forwardedFor = req.headers.get("x-forwarded-for") || "";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  try {
    await saveLoginCode(email, userCodeHash, expires);
    // console.log("this the code", code);
    await logAuthEvent({
      email,
      ip,
      userAgent,
      type: "code_sent",
      success: true,
      timestamp: Date.now(),
    });
    await sendCodeEmail(email, code);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error sending login code:", err);

    await logAuthEvent({
      email,
      ip,
      userAgent,
      type: "code_sent",
      success: false,
      error: err instanceof Error ? err.message : String(err),
      timestamp: Date.now(),
    });

    return NextResponse.json(
      { error: "Failed to send verification code." },
      { status: 500 }
    );
  }
}
