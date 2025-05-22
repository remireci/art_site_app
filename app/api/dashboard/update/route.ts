import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findUser, updateUserField, updateLocationField } from "@/db/mongo";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token");

  if (!token || !token.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = JSON.parse(token.value);
  const body = await req.json();
  const { section, field, value } = body;

  if (!section || !field) {
    return NextResponse.json(
      { error: "Missing field or section" },
      { status: 400 }
    );
  }

  try {
    const user = await findUser(email);
    if (!user) throw new Error("User not found");

    if (section === "user") {
      await updateUserField(email, field, value);
    } else if (section === "location") {
      await updateLocationField(user.locationId, field, value);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
