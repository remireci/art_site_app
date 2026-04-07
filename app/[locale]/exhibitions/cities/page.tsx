import { getCities } from "../../../db/mongo.js";
import CityListSearch from "@/components/CityListSearch";
import { Metadata } from "next";
import Link from "next/link";

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
  // Load translations
  const messages = await import(
    `../../../../locales/${params.locale}/exhibitions.json`
  )
    .then((m) => m.default)
    .catch(() =>
      import(`../../../../locales/en/exhibitions.json`).then((m) => m.default),
    );

  return {
    title: messages.cities.metaTitle || "Art Exhibitions by City",
    description:
      messages.cities.metaDescription ||
      "Browse art exhibitions organized by city",
    alternates: {
      canonical: `/${params.locale}/exhibitions/cities`,
    },
    openGraph: {
      title: messages.cities.metaTitle || "Art Exhibitions by City",
      description:
        messages.cities.metaDescription ||
        "Browse art exhibitions organized by city",
      images: [
        {
          url: "/og-cities.jpg", // Add an actual OG image
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function CityList({ params }: LocationsListPageProps) {
  const { locale } = params;
  const cities: Array<any> = await getCities({ onlyWithExhibitions: true });
  const messages = await import(
    `../../../../locales/${params.locale}/exhibitions.json`
  )
    .then((m) => m.default)
    .catch(() =>
      import(`../../../../locales/en/exhibitions.json`).then((m) => m.default),
    );

  const sortedCities = [...cities].sort((a, b) =>
    (a.city || "").localeCompare(b.city || "", locale),
  );

  return (
    <div className="min-h-screen px-4 py-12 text-slate-600">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <h1 className="mt-12 text-2xl font-semibold text-slate-700">
          {messages.city_title}
        </h1>

        <p className="mt-4 max-w-2xl text-center text-sm text-slate-500">
          Browse modern and contemporary art exhibitions by city.
        </p>

        <div className="my-10">
          <Link
            href={`/${locale}`}
            className="inline-flex h-10 items-center justify-center rounded bg-[#87bdd8] px-4 text-sm uppercase text-slate-100 hover:bg-blue-800 hover:text-gray-200"
          >
            {messages.search}
          </Link>
        </div>

        <CityListSearch
          cities={sortedCities}
          locale={locale}
          placeholder={messages.city_search_placeholder || "Search a city"}
          noResultsText={messages.city_no_results || "No cities found."}
        />
      </div>
    </div>
  );
}
