import { NextResponse } from "next/server";
import { checkLoginCode } from "@/db/mongo";
import { isRateLimited } from "@/lib/ratelimit";
import { logAuthEvent } from "@/lib/auth/logAuthEvent";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    if (!code) {
      await logAuthEvent({
        email,
        ip,
        userAgent,
        type: "code_verified",
        success: false,
        error: "Missing code",
      });
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      );
    }

    const rateKey = `login_attempt:${email}`;
    if (await isRateLimited(rateKey, 5, 600)) {
      await logAuthEvent({
        email,
        ip,
        userAgent,
        type: "rate_limited",
        success: false,
        error: "Too many attempts",
      });

      return NextResponse.json(
        { success: false, error: "Too many attempts. Try to signup again." },
        { status: 429 }
      );
    }

    const data = await checkLoginCode(email, code);

    if (!data.valid) {
      await logAuthEvent({
        email,
        ip,
        userAgent,
        type: "code_verified",
        success: false,
        error: data.reason || "Invalid code",
      });

      return NextResponse.json(
        { success: false, error: data.reason || "Invalid code." },
        { status: 401 }
      );
    }

    await logAuthEvent({
      email,
      ip,
      userAgent,
      type: "code_verified",
      success: true,
    });

    const res = NextResponse.json({ success: true, email });
    res.cookies.set("auth_token", JSON.stringify({ email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired code" },
      { status: 401 }
    );
  }
}
