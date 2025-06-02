import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "@/models/User";
import Location from "@/models/Location";
import { findUser, getLocationByDomain, createUser } from "@/db/mongo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token");

    if (!token || !token.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = JSON.parse(token.value);
    // const email = parsed.email;
    const email = "dirk_mertens@fastmail.fm";
    const domain = email.split("@")[1];

    let user = await findUser(email);

    if (!user) {
      const location = await getLocationByDomain(domain);

      //   console.log("this is the location", location);
      user = await createUser(email, location?._id || null);

      return NextResponse.json({
        user: {
          email: user?.email,
          role: user?.role || "user",
        },
        location,
      });
    }

    const location = user.locationId ? await getLocationByDomain(domain) : null;

    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name || null,
        role: user.role || "user",
      },
      location,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
