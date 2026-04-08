import { NextResponse } from "next/server";

const LANGUAGES = ["en", "nl", "fr"];
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.artnowdatabase.eu"
    : "http://localhost:3000";

export const revalidate = 3600;

export async function GET() {
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${LANGUAGES.map(
    (lang) => `
  <sitemap>
    <loc>${BASE_URL}/sitemap-${lang}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
  ).join("")}
</sitemapindex>`.trim();

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=60",
    },
  });
}
