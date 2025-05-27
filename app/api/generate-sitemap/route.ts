export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { sitemap } from "../../../scripts/sitemap";

export async function GET() {
  try {
    await sitemap();
    return NextResponse.json({ message: "Sitemap generated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
