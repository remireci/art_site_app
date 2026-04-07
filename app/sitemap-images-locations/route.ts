import { NextResponse } from "next/server";
import { buildLocationImageSitemapXml } from "@/lib/sitemaps/imageSitemap";

export const revalidate = 3600;

export async function GET() {
  const xml = await buildLocationImageSitemapXml();

  const sizeBytes = Buffer.byteLength(xml, "utf8");
  console.log("bytes:", sizeBytes);
  console.log("KB:", (sizeBytes / 1024).toFixed(2));
  console.log("MB:", (sizeBytes / 1024 / 1024).toFixed(2));

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=60",
    },
  });
}
