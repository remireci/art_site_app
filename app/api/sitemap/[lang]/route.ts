import { NextRequest, NextResponse } from "next/server";
import { getLocations, getCities } from "@/db/mongo";

const LANGUAGES = ["en", "nl", "fr"] as const;

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.artnowdatabase.eu"
    : "http://localhost:3000";

type Lang = (typeof LANGUAGES)[number];

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

type LocationLike = {
  domain_slug?: string;
};

type CityLike = {
  slug?: string;
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
          (alt: AlternateUrl) =>
            `<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.loc}" />`,
        )
        .join("\n")}
    </url>`,
    )
    .join("")}
</urlset>`;
}

function generateLocalizedUrls(path: string): AlternateUrl[] {
  return LANGUAGES.map((lang) => ({
    loc: `${BASE_URL}/${lang}${path}`,
    hreflang: lang,
  }));
}

export const revalidate = 3600;

export async function GET(
  req: NextRequest,
  context: { params: { lang: string } },
) {
  const lang = context.params.lang as Lang;

  if (!LANGUAGES.includes(lang)) {
    return new NextResponse("Invalid language", { status: 400 });
  }

  try {
    const [locationsData, citiesData] = await Promise.all([
      getLocations({ onlyWithExhibitions: true }),
      getCities({ onlyWithExhibitions: true }),
    ]);

    const now = new Date().toISOString();

    const locationEntries: SitemapEntry[] = (locationsData as LocationLike[])
      .filter((location) => location.domain_slug)
      .map((location) => {
        const basePath = `/exhibitions/locations/${location.domain_slug}`;
        return {
          url: `${BASE_URL}/${lang}${basePath}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: generateLocalizedUrls(basePath),
        };
      });

    const cityEntries: SitemapEntry[] = (citiesData as CityLike[])
      .filter((city) => city.slug)
      .map((city) => {
        const basePath = `/exhibitions/cities/${city.slug}`;
        return {
          url: `${BASE_URL}/${lang}${basePath}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: generateLocalizedUrls(basePath),
        };
      });

    const staticRoutes: SitemapEntry[] = [
      "",
      "/exhibitions/cities",
      "/exhibitions/locations",
      "/advertising",
      "/on-the-map",
      "/texts",
    ].map((route) => ({
      url: `${BASE_URL}/${lang}${route}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: generateLocalizedUrls(route),
    }));

    const seoCityRoutes = [
      "/paris-art-exhibitions",
      "/paris-art-exhibitions/this-week",
      "/berlin-art-exhibitions",
      "/amsterdam-art-exhibitions",
      "/brussels-art-exhibitions",
      "/zurich-art-exhibitions",
      "/art-exhibitions-in-europe",
    ].map((route) => ({
      url: `${BASE_URL}/${lang}${route}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: generateLocalizedUrls(route),
    }));

    const allEntries = [
      ...staticRoutes,
      ...locationEntries,
      ...cityEntries,
      ...seoCityRoutes,
    ];
    const xml = generateSitemapXml(allEntries);

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
