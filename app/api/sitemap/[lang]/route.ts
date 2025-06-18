import { NextRequest } from "next/server";
import { getLocations, getCities } from "@/db/mongo";

const LANGUAGES = ["en", "nl", "fr"];

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.artnowdatabase.eu"
    : "http://localhost:3000";

type AlternateUrl = {
  hreflang: string;
  loc: string;
};

type SitemapEntry = {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
  alternates: AlternateUrl[];
};

function generateSitemapXml(entries: SitemapEntry[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${entries
    .map(
      (entry) => `
    <url>
      <loc>${entry.url}</loc>
      <lastmod>${entry.lastModified}</lastmod>
      <changefreq>${entry.changeFrequency}</changefreq>
      <priority>${entry.priority}</priority>
      ${entry.alternates
        .map(
          (alt: any) =>
            `<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.loc}" />`
        )
        .join("\n")}
    </url>`
    )
    .join("")}
</urlset>`;
}

function generateLocalizedUrls(path: string) {
  return LANGUAGES.map((lang) => ({
    loc: `${BASE_URL}/${lang}${path}`,
    hreflang: lang,
  }));
}

export async function GET(
  req: NextRequest,
  context: { params: { lang: string } }
) {
  const lang = context.params.lang;

  if (!LANGUAGES.includes(lang)) {
    return new Response("Invalid language", { status: 400 });
  }

  try {
    const [locationsData, citiesData] = await Promise.all([
      getLocations({ onlyWithExhibitions: true }),
      getCities({ onlyWithExhibitions: true }),
    ]);

    const now = new Date().toISOString();

    const locationEntries = locationsData.map((location: any) => {
      const basePath = `/exhibitions/locations/${location.domain_slug}`;
      return {
        url: `${BASE_URL}/${lang}${basePath}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: generateLocalizedUrls(basePath),
      };
    });

    const cityEntries = citiesData.map((city: any) => {
      const basePath = `/exhibitions/cities/${city.slug}`;

      return {
        url: `${BASE_URL}/${lang}${basePath}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: generateLocalizedUrls(basePath),
      };
    });

    const staticRoutes = [
      "",
      "/exhibitions/cities",
      "/exhibitions/locations",
      "/advertising",
      "/on-the-map",
      "/texts",
    ].map((route) => {
      return {
        url: `${BASE_URL}/${lang}${route}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1,
        alternates: generateLocalizedUrls(route),
      };
    });

    const allEntries = [...staticRoutes, ...locationEntries, ...cityEntries];

    const xml = generateSitemapXml(allEntries);

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Server error", { status: 500 });
  }
}
