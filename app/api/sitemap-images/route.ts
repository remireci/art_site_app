// app/sitemap-images/route.ts
import { getAgendaItems, getLocations, getCities } from "@/db/mongo";
import { NextResponse } from "next/server";

const BASE_URL = "https://www.artnowdatabase.eu";
const LANGUAGES = ["en", "fr", "nl"];

export async function GET() {
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0];

  const [exhibitions, locationsData, citiesData] = await Promise.all([
    getAgendaItems(
      {
        image_reference: { $exists: true, $ne: [] },
        show: true,
        date_end_st: { $gt: currentDateString },
        $or: [
          { date_begin_st: { $exists: false } },
          { date_begin_st: null },
          { date_begin_st: "" },
          { date_begin_st: { $not: { $regex: /^\d{4}-\d{2}-\d{2}$/ } } },
          {
            date_begin_st: {
              $lte: currentDateString,
              $regex: /^\d{4}-\d{2}-\d{2}$/,
            },
          },
        ],
      },
      {
        title: 1,
        image_reference: 1,
        location: 1,
        city: 1,
        domain: 1,
      }
    ),
    getLocations({ onlyWithExhibitions: true }),
    getCities({ onlyWithExhibitions: true }),
  ]);

  // Build lookup maps
  const domainToSlug = new Map();
  for (const loc of locationsData) {
    if (loc.domain && loc.domain_slug) {
      domainToSlug.set(loc.domain, loc.domain_slug);
    }
  }

  const cityToSlug = new Map();
  for (const city of citiesData) {
    if (city.city && city.slug) {
      cityToSlug.set(city.city, city.slug);
    }
  }

  const locationGroups = new Map(); // domainSlug → { images, venue, city }
  const cityGroups = new Map(); // citySlug → { images, cityName }
  const now = new Date().toISOString();

  for (const ex of exhibitions) {
    const domain = ex.domain;
    const city = ex.city;
    const domainSlug = domainToSlug.get(domain);
    const citySlug = cityToSlug.get(city);
    if (!domainSlug) continue;

    if (domainSlug) {
      if (!locationGroups.has(domainSlug)) {
        locationGroups.set(domainSlug, {
          images: [],
          venue: ex.location || "",
          city: city,
        });
      }
      for (const image of ex.image_reference) {
        if (typeof image === "string" && image.includes("agenda/")) {
          const imageName = image.split("?")[0].split("agenda/")[1];
          const optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/format=auto,fit=cover,width=300/agenda/${encodeURI(
            imageName
          )}`;

          locationGroups.get(domainSlug).images.push({
            url: optimizedUrl,
            title: ex.title,
            venue: ex.location || "",
            city: city || "",
          });
        }
      }
    }

    // group by city
    if (citySlug) {
      if (!cityGroups.has(citySlug)) {
        cityGroups.set(citySlug, {
          images: [],
          city: city,
          venue: ex.location || "",
        });
      }
      for (const image of ex.image_reference) {
        if (typeof image === "string" && image.includes("agenda/")) {
          const imageName = image.split("?")[0].split("agenda/")[1];
          const optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/format=auto,fit=cover,width=300/agenda/${encodeURI(
            imageName
          )}`;

          cityGroups.get(citySlug).images.push({
            url: optimizedUrl,
            title: ex.title,
            venue: ex.location || "",
            city: city || "",
          });
        }
      }
    }
  }

  const generateUrlEntries = (
    basePath: string,
    images: { url: string; title: string; venue: string; city: string }[],
    cityName: string
  ) =>
    LANGUAGES.map((lang) => {
      const pageUrl = `${BASE_URL}/${lang}${basePath}`;
      const imageTags = images
        .map(
          (img) => `
        <image:image>
          <image:loc>${img.url}</image:loc>
          <image:title><![CDATA[${img.title}]]></image:title>
          <image:caption><![CDATA[Image courtesy of ${img.venue} Used for promotional purposes only]]></image:caption>
          <image:geo_location><![CDATA[${cityName}]]></image:geo_location>
        </image:image>`
        )
        .join("");

      const alternateLinks = LANGUAGES.map(
        (altLang) => `
        <xhtml:link rel="alternate" hreflang="${altLang}" href="${BASE_URL}/${altLang}${basePath}"/>`
      ).join("");

      return `
      <url>
        <loc>${pageUrl}</loc>
        <lastmod>${now}</lastmod>
        ${alternateLinks}
        ${imageTags}
      </url>`;
    }).join("");

  const locationXml = Array.from(locationGroups.entries())
    .map(([slug, { images, venue, city }]) =>
      generateUrlEntries(`/exhibitions/locations/${slug}`, images, venue)
    )
    .join("");

  const cityXml = Array.from(cityGroups.entries())
    .map(([slug, { images, city }]) =>
      generateUrlEntries(`/exhibitions/cities/${slug}`, images, city)
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${locationXml}
  ${cityXml}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=60",
    },
  });
}
