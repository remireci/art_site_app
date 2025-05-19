import { NextResponse } from "next/server";
import { verifyInviteToken } from "@/lib/auth/inviteToken";
import { logAuthEvent } from "@/lib/auth/logAuthEvent";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const { token } = await req.json();

  if (!token) {
    await logAuthEvent({
      email: "unknown",
      ip,
      userAgent,
      type: "invite_token_check",
      success: false,
      error: "Token missing",
    });
    return NextResponse.json({ error: "Token missing" }, { status: 400 });
  }

  try {
    const data = verifyInviteToken(token);

    await logAuthEvent({
      email: data.email,
      ip,
      userAgent,
      type: "invite_token_check",
      success: true,
    });

    return NextResponse.json({
      success: true,
      email: data.email,
      locationId: data.locationId,
    });
  } catch (err) {
    await logAuthEvent({
      email: "unknown",
      ip,
      userAgent,
      type: "invite_token_check",
      success: false,
      error: "Invalid or expired token",
    });
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
