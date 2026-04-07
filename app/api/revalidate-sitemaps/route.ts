import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

async function warmUrl(url: string) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "artnow-sitemap-warmer/1.0",
    },
    cache: "no-store",
  });

  return {
    url,
    status: res.status,
    ok: res.ok,
  };
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Missing REVALIDATE_SECRET env var" },
      { status: 500 },
    );
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const paths = [
    "/api/sitemap",
    "/api/sitemap/en",
    "/api/sitemap/nl",
    "/api/sitemap/fr",
    "/sitemap-images",
    "/sitemap-images-locations",
    "/sitemap-images-cities",
  ];

  const publicUrls = [
    "/sitemap.xml",
    "/sitemap-en.xml",
    "/sitemap-nl.xml",
    "/sitemap-fr.xml",
    "/sitemap-images.xml",
    "/sitemap-images-locations.xml",
    "/sitemap-images-cities.xml",
  ];

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.artnowdatabase.eu";

  try {
    for (const path of paths) {
      revalidatePath(path);
    }

    const warmed = [];
    for (const publicUrl of publicUrls) {
      warmed.push(await warmUrl(`${baseUrl}${publicUrl}`));
    }

    return NextResponse.json({
      ok: true,
      revalidated: paths,
      warmed,
      at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to revalidate/warm sitemaps:", error);

    return NextResponse.json(
      { ok: false, error: "Failed to revalidate or warm sitemap paths" },
      { status: 500 },
    );
  }
}
