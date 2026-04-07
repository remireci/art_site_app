import { NextResponse } from "next/server";
import { buildImageSitemapIndexXml } from "@/lib/sitemaps/imageSitemap";

export const revalidate = 3600;

export async function GET() {
  const xml = buildImageSitemapIndexXml();

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=60",
    },
  });
}
