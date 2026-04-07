import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const paths = [
    "/sitemap-images",
    "/sitemap-images-locations",
    "/sitemap-images-cities",
    // "/sitemap.xml",
  ];

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    revalidated: paths,
    at: new Date().toISOString(),
  });
}
