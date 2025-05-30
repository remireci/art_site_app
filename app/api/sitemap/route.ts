// app/api/sitemap/route.js or route.ts
import { NextResponse } from "next/server";
import { sitemap } from "../../../scripts/sitemap";

export async function GET() {
  try {
    await sitemap(); // This function does the same thing as before
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
