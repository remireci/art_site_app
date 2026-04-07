import { getLocations } from "../../../db/mongo.js";
import Link from "next/link";
import { Metadata } from "next";
import LocationListSearch from "@/components/LocationListSearch";

interface LocationsListPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const messages = await import(
    `../../../../locales/${params.locale}/exhibitions.json`
  )
    .then((m) => m.default)
    .catch(() =>
      import(`../../../../locales/en/exhibitions.json`).then((m) => m.default),
    );

  return {
    title: messages.locations.metaTitle || "Art Venues Worldwide",
    description:
      messages.locations.metaDescription ||
      "Discover art galleries and museums hosting current exhibitions",
    alternates: {
      canonical: `/${params.locale}/exhibitions/locations`,
    },
    keywords:
      messages.locations.metaKeywords ||
      "art venues, museums, galleries, exhibition spaces",
  };
}

export default async function LocationsListPage({
  params,
}: LocationsListPageProps) {
  const { locale } = params;

  const locations: Array<any> = await getLocations({
    onlyWithExhibitions: true,
  });

  const messages = await import(
    `../../../../locales/${params.locale}/exhibitions.json`
  )
    .then((m) => m.default)
    .catch(() =>
      import(`../../../../locales/en/exhibitions.json`).then((m) => m.default),
    );

  const filteredLocations = locations
    .filter(
      (location) =>
        location.name && location.name !== "N/A" && location.domain_slug,
    )
    .sort((a, b) => (a.name || "").localeCompare(b.name || "", locale));

  return (
    <div className="min-h-screen px-4 py-12 text-slate-600">
      <div className="mx-auto max-w-5xl">
        <header className="mt-12 text-center">
          <h1 className="text-2xl font-semibold text-slate-700">
            {messages.location_title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500">
            Browse modern and contemporary art exhibitions by museum, gallery,
            and art venue.
          </p>
        </header>

        <div className="mt-8 flex justify-center">
          <Link
            href={`/${locale}`}
            className="text-sm text-slate-500 underline underline-offset-4 hover:text-slate-700"
          >
            {messages.search}
          </Link>
        </div>

        <div className="mt-10">
          <LocationListSearch
            locations={filteredLocations}
            locale={locale}
            placeholder={
              messages.location_search_placeholder || "Search a location"
            }
            noResultsText={
              messages.location_no_results || "No locations found."
            }
          />
        </div>
      </div>
    </div>
  );
}
