import { getAgendaItems, getLocations, getCities } from "@/db/mongo";
import { getSitemapImageUrl } from "@/utils/getSitemapImageUrl";

const BASE_URL = "https://www.artnowdatabase.eu";
const LANGUAGES = ["en", "fr", "nl"] as const;

type SitemapImage = {
  url: string;
  title: string;
  venue: string;
  city: string;
};

type LocationGroup = {
  images: SitemapImage[];
  venue: string;
  city: string;
};

type CityGroup = {
  images: SitemapImage[];
  city: string;
  venue: string;
};

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function dedupeImages(images: SitemapImage[]) {
  const seen = new Set<string>();
  const result: SitemapImage[] = [];

  for (const img of images) {
    if (!img.url) continue;
    if (seen.has(img.url)) continue;
    seen.add(img.url);
    result.push(img);
  }

  return result;
}

async function getBaseImageSitemapData() {
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
      },
    ),
    getLocations({ onlyWithExhibitions: true }),
    getCities({ onlyWithExhibitions: true }),
  ]);

  const domainToSlug = new Map<string, string>();
  for (const loc of locationsData) {
    if (loc.domain && loc.domain_slug) {
      domainToSlug.set(loc.domain, loc.domain_slug);
    }
  }

  const cityToSlug = new Map<string, string>();
  for (const city of citiesData) {
    if (city.city && city.slug) {
      cityToSlug.set(city.city, city.slug);
    }
  }

  const locationGroups = new Map<string, LocationGroup>();
  const cityGroups = new Map<string, CityGroup>();

  for (const ex of exhibitions) {
    const domainSlug = ex.domain ? domainToSlug.get(ex.domain) : undefined;
    const cityName = ex.city || "";
    const citySlug = cityName ? cityToSlug.get(cityName) : undefined;

    if (domainSlug) {
      if (!locationGroups.has(domainSlug)) {
        locationGroups.set(domainSlug, {
          images: [],
          venue: ex.location || "",
          city: cityName,
        });
      }

      for (const image of ex.image_reference || []) {
        if (typeof image !== "string" || !image.includes("agenda/")) continue;

        const sitemapImageUrl = getSitemapImageUrl(image);
        if (!sitemapImageUrl) continue;

        locationGroups.get(domainSlug)!.images.push({
          url: sitemapImageUrl,
          title: ex.title || "",
          venue: ex.location || "",
          city: cityName,
        });
      }
    }

    if (citySlug) {
      if (!cityGroups.has(citySlug)) {
        cityGroups.set(citySlug, {
          images: [],
          city: cityName,
          venue: ex.location || "",
        });
      }

      for (const image of ex.image_reference || []) {
        if (typeof image !== "string" || !image.includes("agenda/")) continue;

        const sitemapImageUrl = getSitemapImageUrl(image);
        if (!sitemapImageUrl) continue;

        cityGroups.get(citySlug)!.images.push({
          url: sitemapImageUrl,
          title: ex.title || "",
          venue: ex.location || "",
          city: cityName,
        });
      }
    }
  }

  for (const [, group] of locationGroups) {
    group.images = dedupeImages(group.images);
  }

  for (const [, group] of cityGroups) {
    group.images = dedupeImages(group.images);
  }

  return { locationGroups, cityGroups };
}

function generateUrlEntries(
  basePath: string,
  images: SitemapImage[],
  geoLocation: string,
) {
  return LANGUAGES.map((lang) => {
    const pageUrl = `${BASE_URL}/${lang}${basePath}`;

    const alternateLinks = LANGUAGES.map(
      (altLang) =>
        `<xhtml:link rel="alternate" hreflang="${altLang}" href="${BASE_URL}/${altLang}${basePath}"/>`,
    ).join("");

    const imageTags = images
      .map((img) => {
        const caption = img.venue
          ? `Image courtesy of ${img.venue} Used for promotional purposes only`
          : "Used for promotional purposes only";

        return `
        <image:image>
          <image:loc>${xmlEscape(img.url)}</image:loc>
          <image:title><![CDATA[${img.title || ""}]]></image:title>
          <image:caption><![CDATA[${caption}]]></image:caption>
          <image:geo_location><![CDATA[${geoLocation || ""}]]></image:geo_location>
        </image:image>`;
      })
      .join("");

    return `
      <url>
        <loc>${xmlEscape(pageUrl)}</loc>
        ${alternateLinks}
        ${imageTags}
      </url>`;
  }).join("");
}

function wrapUrlSet(innerXml: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${innerXml}
</urlset>`;
}

export async function buildLocationImageSitemapXml() {
  const { locationGroups } = await getBaseImageSitemapData();

  const xmlBody = Array.from(locationGroups.entries())
    .map(([slug, group]) =>
      generateUrlEntries(
        `/exhibitions/locations/${slug}`,
        group.images,
        group.city,
      ),
    )
    .join("");

  return wrapUrlSet(xmlBody);
}

export async function buildCityImageSitemapXml() {
  const { cityGroups } = await getBaseImageSitemapData();

  const xmlBody = Array.from(cityGroups.entries())
    .map(([slug, group]) =>
      generateUrlEntries(
        `/exhibitions/cities/${slug}`,
        group.images,
        group.city,
      ),
    )
    .join("");

  return wrapUrlSet(xmlBody);
}

export function buildImageSitemapIndexXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-images-locations.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-images-cities.xml</loc>
  </sitemap>
</sitemapindex>`;
}
