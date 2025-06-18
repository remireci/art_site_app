import { NextResponse } from "next/server";
import { findUser, getLocationByDomain, saveLoginCode } from "@/db/mongo";
import { sendCodeEmail } from "@/lib/email/sendCodeEmail";
import { hashCode } from "@/lib/codeUtils";
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

  const location = await getLocationByDomain(domain);

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
        error: "Unrecognized institution",
      },
      { status: 403 }
    );
  }

  const existing = await findUser({ email });

  // if token but not yet a user, the user should be created
  if (!existing) {
    const location = await getLocationByDomain(domain);

    console.log("this is the location", location);

    if (location && location.show === false) {
      return NextResponse.json(
        {
          error:
            "This institution is currently not accepted. \nPlease contact \ninfo@artnowdatabase.eu",
        },
        { status: 403 }
      );
    }
  }

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

  // generate and save login code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000;
  const hashed = hashCode(code);

  try {
    await saveLoginCode(email, hashed, expires);
    await sendCodeEmail(email, code); // can be HTML-based with contextual instructions

    await logAuthEvent({
      email,
      ip,
      userAgent,
      type: "invite_requested",
      success: true,
      metadata: { locationId: location._id.toString() },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to process invite-to-login:", err);

    await logAuthEvent({
      email,
      ip,
      userAgent,
      type: "invite_requested",
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });

    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { findUser, getLocationByDomain } from "@/db/mongo";
// import { createInviteToken } from "@/lib/auth/inviteToken";
// import { sendInviteEmail } from "@/lib/email/sendInviteEmail";
// import { logAuthEvent } from "@/lib/auth/logAuthEvent";

// export async function POST(req: Request) {
//   const { email } = await req.json();
//   const ip = req.headers.get("x-forwarded-for") || "unknown";
//   const userAgent = req.headers.get("user-agent") || "unknown";

//   if (!email || !email.includes("@")) {
//     await logAuthEvent({
//       email: "unknown",
//       ip,
//       userAgent,
//       type: "invite_requested",
//       success: false,
//       error: "Invalid email format",
//     });
//     return NextResponse.json({ error: "Invalid email" }, { status: 400 });
//   }

//   const domain = email.split("@")[1];

//   const location = await getLocationByDomain(domain);

//   if (!location) {
//     await logAuthEvent({
//       email,
//       ip,
//       userAgent,
//       type: "invite_requested",
//       success: false,
//       error: "Unknown domain or no institution match",
//     });

//     return NextResponse.json(
//       {
//         error: "Unrecognized institution",
//       },
//       { status: 403 }
//     );
//   }

//   const existing = await findUser({ email });

//   if (existing) {
//     await logAuthEvent({
//       email,
//       ip,
//       userAgent,
//       type: "invite_requested",
//       success: false,
//       error: "User already exists",
//     });

//     return NextResponse.json({ error: "User already exists" }, { status: 409 });
//   }

//   const token = createInviteToken(email, location._id);
//   await sendInviteEmail(email, token);
//   await logAuthEvent({
//     email,
//     ip,
//     userAgent,
//     type: "invite_requested",
//     success: true,
//     metadata: { locationId: location._id.toString() },
//   });

//   return NextResponse.json({ success: true });
// }
