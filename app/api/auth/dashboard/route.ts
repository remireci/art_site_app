// app/api/dashboard/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "@/models/User";
import Location from "@/models/Location";
import { findUser } from "@/db/mongo";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token");

    if (!token || !token.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = JSON.parse(token.value);
    const email = parsed.email;

    const user = await findUser({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const location = await Location.findById(user.locationId);

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
