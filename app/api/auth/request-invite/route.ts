import { NextResponse } from "next/server";
import { findUser, getLocationByDomain } from "@/db/mongo";
import { createInviteToken } from "@/lib/auth/inviteToken";
import { sendInviteEmail } from "@/lib/email/sendInviteEmail";
import { logAuthEvent } from "@/lib/auth/logAuthEvent";

export async function POST(req: Request) {
  const { email } = await req.json();
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  if (!email || !email.includes("@")) {
    await logAuthEvent({
      email: "unknown",
      ip,
      userAgent,
      type: "invite_requested",
      success: false,
      error: "Invalid email format",
    });
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const domain = email.split("@")[1];

  const location = await getLocationByDomain({ domain });

  if (!location) {
    await logAuthEvent({
      email,
      ip,
      userAgent,
      type: "invite_requested",
      success: false,
      error: "Unknown domain or no institution match",
    });

    return NextResponse.json(
      {
        error:
          "No matching institution found. If your institution is not yet listed, please contact us at info@artnowdatabase.eu to request inclusion.",
      },
      { status: 403 }
    );
  }

  const existing = await findUser({ email });

  if (existing) {
    await logAuthEvent({
      email,
      ip,
      userAgent,
      type: "invite_requested",
      success: false,
      error: "User already exists",
    });

    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const token = createInviteToken(email, location._id);
  await sendInviteEmail(email, token);
  await logAuthEvent({
    email,
    ip,
    userAgent,
    type: "invite_requested",
    success: true,
    metadata: { locationId: location._id.toString() },
  });

  return NextResponse.json({ success: true });
}
