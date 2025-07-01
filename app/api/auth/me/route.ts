import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = cookies().get("auth_token")?.value;
  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.json({ loggedIn: true });
}
