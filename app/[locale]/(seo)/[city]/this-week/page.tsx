import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOptimizedSrc } from "@/utils/getOptimizedSrc";
import {
  getCityBySlugOrAlternative,
  getExhibitionsForMappedCity,
} from "@/db/mongo";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

type Exhibition = {
  _id: string | { toString: () => string };
  title?: string;
  location?: string;
  city?: string;
  description?: string;
  artists?: string;
  date_begin_st?: string;
  date_end_st?: string;
  image_reference?: string[];
  exhibition_url?: string;
  url?: string;
  domain?: string;
};

type CitySeoConfig = {
  displayName: string;
  thisWeekIntro?: string;
  priorityDomains?: string[];
  priorityLocationKeywords?: string[];
};

const CITY_SEO_CONFIG: Record<string, CitySeoConfig> = {
  paris: {
    displayName: "Paris",
    thisWeekIntro:
      "Discover modern and contemporary art exhibitions currently on view this week in Paris, including major museum, foundation, and gallery shows.",
    priorityDomains: [
      "centrepompidou.fr",
      "palaisdetokyo.com",
      "mam.paris.fr",
      "fondationlouisvuitton.fr",
      "grandpalais.fr",
    ],
    priorityLocationKeywords: [
      "centre pompidou",
      "palais de tokyo",
      "musée d'art moderne de paris",
      "musee d'art moderne de paris",
      "fondation louis vuitton",
      "grand palais",
    ],
  },
};

function getSeoBaseSlug(routeSlug?: string) {
  if (!routeSlug) return null;
  if (!routeSlug.endsWith("-art-exhibitions")) return null;
  return routeSlug
    .replace(/-art-exhibitions$/, "")
    .toLowerCase()
    .trim();
}

function parseDate(dateStr?: string) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

function formatDate(dateStr?: string) {
  if (!dateStr || typeof dateStr !== "string" || !dateStr.includes("-")) {
    return "";
  }
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}

function isValidExhibitionRange(exhibition: Exhibition) {
  const startDate = parseDate(exhibition.date_begin_st);
  const endDate = parseDate(exhibition.date_end_st);
  if (!startDate || !endDate) return false;
  return startDate <= endDate;
}

function isOnViewThisWeek(exhibition: Exhibition) {
  if (!isValidExhibitionRange(exhibition)) return false;

  const now = new Date();
  const startDate = parseDate(exhibition.date_begin_st)!;
  const endDate = parseDate(exhibition.date_end_st)!;

  return now >= startDate && now <= endDate;
}

function hasImage(exhibition: Exhibition) {
  return (
    Array.isArray(exhibition.image_reference) &&
    exhibition.image_reference.length > 0 &&
    !!exhibition.image_reference[0]
  );
}

function stripHtml(html?: string) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getDescriptionPreview(html?: string, maxLength = 180) {
  const text = stripHtml(html);
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

function getInstitutionScore(
  exhibition: Exhibition,
  config?: CitySeoConfig,
): number {
  const url = (exhibition.exhibition_url || exhibition.url || "").toLowerCase();
  const location = (exhibition.location || "").toLowerCase();

  let score = 0;

  config?.priorityDomains?.forEach((domain, index) => {
    if (
      url.includes(domain.toLowerCase()) ||
      (exhibition.domain || "").toLowerCase().includes(domain.toLowerCase())
    ) {
      score = Math.max(score, 100 - index * 5);
    }
  });

  config?.priorityLocationKeywords?.forEach((keyword, index) => {
    if (location.includes(keyword.toLowerCase())) {
      score = Math.max(score, 95 - index * 5);
    }
  });

  return score;
}

function sortExhibitionsForThisWeek(
  exhibitions: Exhibition[],
  config?: CitySeoConfig,
) {
  return [...exhibitions].sort((a, b) => {
    const scoreA = getInstitutionScore(a, config);
    const scoreB = getInstitutionScore(b, config);

    if (scoreA !== scoreB) return scoreB - scoreA;

    const endA = parseDate(a.date_end_st)?.getTime() ?? Infinity;
    const endB = parseDate(b.date_end_st)?.getTime() ?? Infinity;

    if (endA !== endB) return endA - endB;

    const startA = parseDate(a.date_begin_st)?.getTime() ?? Infinity;
    const startB = parseDate(b.date_begin_st)?.getTime() ?? Infinity;

    return startA - startB;
  });
}

function getMetadataDescription(cityName: string) {
  return `Discover modern and contemporary art exhibitions on view this week in ${cityName}. Browse current shows, venues, images, and direct links on Art Now Database.`;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; city: string };
}): Promise<Metadata> {
  const { locale, city: routeCity } = params;

  const baseSlug = getSeoBaseSlug(routeCity);
  if (!baseSlug) return {};

  // Launch only for Paris for now
  if (baseSlug !== "paris") return {};

  const cityRecord = await getCityBySlugOrAlternative(baseSlug);
  if (!cityRecord) return {};

  const canonicalSlug = cityRecord.slug.toLowerCase();
  const config = CITY_SEO_CONFIG[canonicalSlug];
  if (!config) return {};

  const result = await getExhibitionsForMappedCity(cityRecord);
  const exhibitions: Exhibition[] = (result.exhibitions || [])
    .filter(hasImage)
    .filter(isOnViewThisWeek);

  const cityName = cityRecord.city || config.displayName;
  const exhibitionWithImage = exhibitions.find(
    (item) => item.image_reference?.[0],
  );
  const image = exhibitionWithImage?.image_reference?.[0];
  const optimizedUrl = image ? getOptimizedSrc(image) : undefined;

  const baseUrl = "https://www.artnowdatabase.eu";
  const canonicalUrl = `${baseUrl}/${locale}/${canonicalSlug}-art-exhibitions/this-week`;
  const title = `${cityName} art exhibitions this week | Modern & contemporary art`;

  return {
    title,
    description: getMetadataDescription(cityName),
    keywords: [
      `${cityName} art exhibitions this week`,
      `${cityName} exhibitions this week`,
      `${cityName} contemporary art this week`,
      `what's on in ${cityName} this week`,
      `${cityName} museums this week`,
    ].join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: getMetadataDescription(cityName),
      url: canonicalUrl,
      type: "website",
      siteName: "Art Now Database",
      ...(optimizedUrl
        ? {
            images: [
              {
                url: optimizedUrl,
                width: 1200,
                height: 630,
                alt: `${cityName} art exhibitions this week`,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: getMetadataDescription(cityName),
      ...(optimizedUrl ? { images: [optimizedUrl] } : {}),
    },
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL(baseUrl),
  };
}

export default async function ThisWeekSeoCityPage({
  params,
}: {
  params: { locale: string; city: string };
}) {
  const { locale, city: routeCity } = params;

  const baseSlug = getSeoBaseSlug(routeCity);
  if (!baseSlug) notFound();

  // Paris only for now
  if (baseSlug !== "paris") notFound();

  const cityRecord = await getCityBySlugOrAlternative(baseSlug);
  if (!cityRecord) notFound();

  const canonicalSlug = cityRecord.slug.toLowerCase();
  const config = CITY_SEO_CONFIG[canonicalSlug];
  if (!config) notFound();

  const result = await getExhibitionsForMappedCity(cityRecord);
  const exhibitions: Exhibition[] = result.exhibitions || [];

  const cityName = cityRecord.city || config.displayName;

  const onViewThisWeek = sortExhibitionsForThisWeek(
    exhibitions.filter(hasImage).filter(isOnViewThisWeek),
    config,
  );

  const featured = onViewThisWeek.slice(0, 24);

  return (
    <main className="min-h-screen mt-20 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-800">
            {cityName} art exhibitions this week
          </h1>

          <p className="mt-4 max-w-3xl text-base md:text-lg text-gray-700">
            {config.thisWeekIntro ||
              `Discover modern and contemporary art exhibitions currently on view this week in ${cityName}.`}
          </p>

          <p className="mt-4 max-w-3xl text-gray-700">
            This page focuses on exhibitions currently on view, helping visitors
            quickly find what is happening in {cityName} right now.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${locale}?city=${encodeURIComponent(cityName)}`}
              className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              Explore {cityName} on the map
            </Link>
            <Link
              href={`/${locale}/${canonicalSlug}-art-exhibitions`}
              className="rounded bg-[#87bdd8] px-4 py-2 text-sm text-white hover:bg-blue-800"
            >
              View all {cityName} exhibitions
            </Link>

            <Link
              href={`/${locale}/exhibitions/cities/${canonicalSlug}`}
              className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              Browse the full {cityName} city page
            </Link>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            On view now in {cityName}
          </h2>
          <p className="mt-3 max-w-3xl text-gray-700">
            The selection below prioritizes notable institutions and currently
            open exhibitions with images and direct links for more information.
          </p>
        </section>

        {featured.length === 0 ? (
          <section className="rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              No current exhibitions found
            </h2>
            <p className="mt-3 text-gray-700">
              We could not find exhibitions currently on view in {cityName} at
              the moment. Please check again soon, or use the full city page and
              map to explore more listings.
            </p>
          </section>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((exhibition, index) => {
              const optimizedUrl = exhibition.image_reference?.[0]
                ? getOptimizedSrc(exhibition.image_reference[0])
                : null;

              const institutionScore = getInstitutionScore(exhibition, config);
              const preview = getDescriptionPreview(exhibition.description);

              return (
                <li
                  key={
                    typeof exhibition._id === "string"
                      ? exhibition._id
                      : exhibition._id.toString()
                  }
                  className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  {optimizedUrl && (
                    <div className="mb-4">
                      <Image
                        priority={index < 3}
                        loading={index < 3 ? "eager" : "lazy"}
                        unoptimized
                        src={optimizedUrl}
                        alt={`${exhibition.title || "Exhibition"} at ${exhibition.location || cityName}`}
                        width={500}
                        height={320}
                        className="h-auto w-full rounded-lg object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        On view now
                      </span>
                      {institutionScore >= 85 && (
                        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
                          Major venue
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-medium text-gray-900">
                      {exhibition.title || "Untitled exhibition"}
                    </h3>

                    {(exhibition.location || exhibition.artists) && (
                      <div className="mt-2 text-sm text-gray-600">
                        {exhibition.location && <p>{exhibition.location}</p>}
                        {exhibition.artists && exhibition.artists !== "N/A" && (
                          <p>{exhibition.artists}</p>
                        )}
                      </div>
                    )}

                    {exhibition.date_end_st && (
                      <div className="mt-3 text-sm text-gray-700">
                        <p>Until {formatDate(exhibition.date_end_st)}</p>
                      </div>
                    )}

                    {preview && (
                      <p className="mt-4 text-sm text-gray-700">{preview}</p>
                    )}

                    <div className="mt-5">
                      <Link
                        href={
                          exhibition.exhibition_url || exhibition.url || "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded bg-slate-200 px-3 py-2 text-sm text-gray-800 hover:bg-slate-300"
                      >
                        More information
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
