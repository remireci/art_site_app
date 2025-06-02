import { NextRequest } from "next/server";

const LANGUAGES = ["en", "nl", "fr"];
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.artnowdatabase.eu"
    : "http://localhost:3000";

type Params = { params: { lang: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const lang = params.lang;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${LANGUAGES.map(
    (lang) => `
  <sitemap>
    <loc>${BASE_URL}/sitemap-${lang}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  `
  ).join("")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
