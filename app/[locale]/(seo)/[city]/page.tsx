import {
  getCityBySlugOrAlternative,
  getExhibitionsForMappedCity,
} from "@/db/mongo";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getOptimizedSrc } from "@/utils/getOptimizedSrc";
import { notFound } from "next/navigation";

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
};

type CitySeoConfig = {
  displayName: string;
  introSecondParagraph?: string;
  priorityDomains?: string[];
  priorityLocationKeywords?: string[];
  cityAliases?: string[];
};

type CityRecord = {
  id: string;
  city: string;
  alternatives?: string[];
  slug: string;
};

const CITY_SEO_CONFIG: Record<string, CitySeoConfig> = {
  paris: {
    displayName: "Paris",
    introSecondParagraph:
      "From major museums and foundations to contemporary art centers and galleries, Paris offers a dense and constantly changing exhibition landscape. This page highlights a selection of notable shows currently on view or opening soon.",
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

  berlin: {
    displayName: "Berlin",
    introSecondParagraph:
      "Berlin has one of Europe’s most active contemporary art scenes, spanning major museums, kunsthalles, and a dense network of galleries and project spaces.",
    priorityDomains: [
      "smb.museum",
      "kw-berlin.de",
      "gropiusbau.de",
      "berlinischegalerie.de",
    ],
    priorityLocationKeywords: [
      "staatliche museen zu berlin",
      "kw berlin",
      "gropius bau",
      "martin-gropius-bau",
      "berlinische galerie",
    ],
  },

  amsterdam: {
    displayName: "Amsterdam",
    introSecondParagraph:
      "Amsterdam offers a strong mix of modern and contemporary art, with major museums alongside experimental institutions and gallery spaces.",
    priorityDomains: [
      "stedelijk.nl",
      "eye.nl",
      "huismarseille.nl",
      "foam.org",
      "rijksmuseum.nl", // less contemporary but still high authority
    ],
    priorityLocationKeywords: [
      "stedelijk museum",
      "eye filmmuseum",
      "huis marseille",
      "foam",
      "rijksmuseum",
    ],
  },

  brussels: {
    displayName: "Brussels",
    introSecondParagraph:
      "Brussels combines major museums with a strong contemporary gallery scene, making it an important hub for modern and contemporary art in Europe.",
    priorityDomains: [
      "kanal.brussels",
      "bozar.be",
      "wiels.org",
      "fine-arts-museum.be",
    ],
    priorityLocationKeywords: [
      "kanal centre pompidou",
      "bozar",
      "wiels",
      "royal museums of fine arts",
    ],
  },

  zurich: {
    displayName: "Zurich",
    introSecondParagraph:
      "Zurich has a compact but influential contemporary art scene, with leading institutions and internationally active galleries.",
    priorityDomains: [
      "kunsthaus.ch",
      "migrosmuseum.ch",
      "westbau.com",
      "hauserwirth.com",
    ],
    priorityLocationKeywords: [
      "kunsthaus zürich",
      "migros museum",
      "luma westbau",
      "hauser & wirth",
    ],
  },
};
// function getCitySlugFromRoute(routeSlug: string) {
//   return routeSlug.replace(/-art-exhibitions$/, "").toLowerCase();
// }

// async function getCityRecordBySeoRoute(routeSlug?: string) {
//   if (!routeSlug) return null;

//   const parsedSlug = routeSlug
//     .replace(/-art-exhibitions$/, "")
//     .toLowerCase()
//     .trim();
//   if (!parsedSlug) return null;

//   const cities = await getCities({ onlyWithExhibitions: true });

//   const match = cities.find((item) => {
//     const slug = item.slug?.toLowerCase?.();
//     const city = item.city?.toLowerCase?.();
//     const alternatives = (item.alternatives || []).map((alt: string) =>
//       alt.toLowerCase(),
//     );

//     return (
//       slug === parsedSlug ||
//       city === parsedSlug ||
//       alternatives.includes(parsedSlug)
//     );
//   });

//   return match || null;
// }

//

function getSeoBaseSlug(routeSlug?: string) {
  if (!routeSlug) return null;
  if (!routeSlug.endsWith("-art-exhibitions")) return null;

  return routeSlug
    .replace(/-art-exhibitions$/, "")
    .toLowerCase()
    .trim();
}

function parseCityRoute(routeSlug?: string) {
  if (!routeSlug) return null;

  if (!routeSlug.endsWith("-art-exhibitions")) return null;

  return routeSlug.replace(/-art-exhibitions$/, "").toLowerCase();
}

function formatDate(dateStr?: string) {
  if (!dateStr || typeof dateStr !== "string" || !dateStr.includes("-")) {
    return "";
  }
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}

function parseDate(dateStr?: string) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

function isValidExhibitionRange(exhibition: Exhibition) {
  const startDate = parseDate(exhibition.date_begin_st);
  const endDate = parseDate(exhibition.date_end_st);
  if (!startDate || !endDate) return false;
  return startDate <= endDate;
}

function isCurrentOrUpcoming(exhibition: Exhibition) {
  if (!isValidExhibitionRange(exhibition)) return false;

  const today = new Date();
  const endDate = parseDate(exhibition.date_end_st)!;

  return today <= endDate;
}

function isCurrent(exhibition: Exhibition) {
  if (!isValidExhibitionRange(exhibition)) return false;

  const today = new Date();
  const startDate = parseDate(exhibition.date_begin_st)!;
  const endDate = parseDate(exhibition.date_end_st)!;

  return today >= startDate && today <= endDate;
}

function getInstitutionScore(
  exhibition: Exhibition,
  config?: CitySeoConfig,
): number {
  const url = (exhibition.exhibition_url || exhibition.url || "").toLowerCase();
  const location = (exhibition.location || "").toLowerCase();

  let score = 0;

  config?.priorityDomains?.forEach((domain, index) => {
    if (url.includes(domain.toLowerCase())) {
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

function stripHtml(html?: string) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getDescriptionPreview(html?: string, maxLength = 220) {
  const text = stripHtml(html);
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

function sortExhibitionsForSeo(
  exhibitions: Exhibition[],
  config?: CitySeoConfig,
) {
  return [...exhibitions].sort((a, b) => {
    const scoreA = getInstitutionScore(a, config);
    const scoreB = getInstitutionScore(b, config);

    if (scoreA !== scoreB) return scoreB - scoreA;

    const currentA = isCurrent(a) ? 1 : 0;
    const currentB = isCurrent(b) ? 1 : 0;

    if (currentA !== currentB) return currentB - currentA;

    const startA = parseDate(a.date_begin_st)?.getTime() ?? Infinity;
    const startB = parseDate(b.date_begin_st)?.getTime() ?? Infinity;

    if (startA !== startB) return startA - startB;

    const endA = parseDate(a.date_end_st)?.getTime() ?? Infinity;
    const endB = parseDate(b.date_end_st)?.getTime() ?? Infinity;

    return endA - endB;
  });
}

function getMetadataDescription(cityName: string) {
  return `Discover current and upcoming modern and contemporary art exhibitions in ${cityName}. Browse exhibition dates, venues, images, and direct links on Art Now Database.`;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; city: string };
}): Promise<Metadata> {
  const { locale, city: routeCity } = params;

  const baseSlug = getSeoBaseSlug(routeCity);

  if (!baseSlug) {
    return {};
  }

  const cityRecord = await getCityBySlugOrAlternative(baseSlug);

  if (!cityRecord) {
    return {};
  }

  const canonicalSlug = cityRecord.slug.toLowerCase();
  const config = CITY_SEO_CONFIG[canonicalSlug];

  if (!config) {
    return {};
  }

  const serverSideExhibitions = await getExhibitionsForMappedCity(cityRecord);
  const exhibitions: Exhibition[] = serverSideExhibitions.exhibitions || [];

  const cityName = cityRecord.city || config.displayName;
  const exhibitionWithImage = exhibitions.find(
    (item) => item.image_reference?.[0],
  );
  const image = exhibitionWithImage?.image_reference?.[0];
  const optimizedUrl = image ? getOptimizedSrc(image) : undefined;

  const baseUrl = "https://www.artnowdatabase.eu";
  const canonicalUrl = `${baseUrl}/${locale}/${canonicalSlug}-art-exhibitions`;
  const title = `${cityName} art exhibitions | Modern & contemporary art`;

  return {
    title,
    description: getMetadataDescription(cityName),
    keywords: [
      `${cityName} art exhibitions`,
      `${cityName} contemporary art`,
      `${cityName} modern art`,
      `art exhibitions in ${cityName}`,
      `${cityName} museums`,
      `${cityName} galleries`,
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
                alt: `${cityName} art exhibitions`,
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

export default async function SeoCityPage({
  params,
}: {
  params: { locale: string; city: string };
}) {
  const { locale, city: routeCity } = params;

  const baseSlug = getSeoBaseSlug(routeCity);

  if (!baseSlug) {
    notFound();
  }

  const cityRecord = await getCityBySlugOrAlternative(baseSlug);

  if (!cityRecord) {
    notFound();
  }

  const canonicalSlug = cityRecord.slug.toLowerCase();
  const config = CITY_SEO_CONFIG[canonicalSlug];

  if (!config) {
    notFound();
  }

  const serverSideExhibitions = await getExhibitionsForMappedCity(cityRecord);
  const exhibitions: Exhibition[] = serverSideExhibitions.exhibitions || [];

  const cityName = cityRecord.city || config.displayName;

  const currentAndUpcoming = exhibitions.filter(isCurrentOrUpcoming);
  const sorted = sortExhibitionsForSeo(currentAndUpcoming, config);
  const featured = sorted.slice(0, 24);

  return (
    <main className="min-h-screen mt-20 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-800">
            {cityName} art exhibitions
          </h1>

          <p className="mt-4 max-w-3xl text-base md:text-lg text-gray-700">
            Discover current and upcoming modern and contemporary art
            exhibitions in {cityName}, with dates, venues, and direct links for
            more information.
          </p>

          {config.introSecondParagraph && (
            <p className="mt-4 max-w-3xl text-gray-700">
              {config.introSecondParagraph}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/exhibitions/cities/${canonicalSlug}`}
              className="rounded bg-[#87bdd8] px-4 py-2 text-sm text-white hover:bg-blue-800"
            >
              View all {cityName} exhibitions
            </Link>

            <Link
              href={`/${locale}?city=${encodeURIComponent(cityName)}`}
              className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Explore {cityName} on the map
            </Link>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            Current and upcoming exhibitions in {cityName}
          </h2>
          <p className="mt-3 max-w-3xl text-gray-700">
            This selection prioritizes notable venues and institutions when
            available, while also highlighting other current and upcoming shows
            in the city.
          </p>
        </section>

        {featured.length === 0 ? (
          <section className="rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              No current exhibitions found
            </h2>
            <p className="mt-3 text-gray-700">
              We could not find current or upcoming exhibitions in {cityName} at
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

              const startDate = parseDate(exhibition.date_begin_st);
              const endDate = parseDate(exhibition.date_end_st);
              const current = isCurrent(exhibition);
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
                      {current && (
                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                          On view now
                        </span>
                      )}
                      {!current && startDate && (
                        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                          Upcoming
                        </span>
                      )}
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

                    <div className="mt-3 text-sm text-gray-700">
                      {startDate && endDate ? (
                        current ? (
                          <p>Until {formatDate(exhibition.date_end_st)}</p>
                        ) : (
                          <p>
                            {formatDate(exhibition.date_begin_st)} –{" "}
                            {formatDate(exhibition.date_end_st)}
                          </p>
                        )
                      ) : null}
                    </div>

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
