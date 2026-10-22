import type { Metadata } from "next";
import Link from "next/link";
import { getMapData } from "@/lib/map/getMapData";
import MapClient from "./MapClient";

export const revalidate = 300;

type PageProps = {
  params: { locale: string };
  searchParams?: { city?: string | string[] };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const descriptions: Record<string, string> = {
    en: "Explore current art exhibitions, museums and galleries on an interactive map.",
    fr: "Découvrez les expositions d'art, musées et galeries sur une carte interactive.",
    nl: "Ontdek actuele kunsttentoonstellingen, musea en galerieën op een interactieve kaart.",
  };

  return {
    title: "Art Exhibitions Map | ArtNowDatabase",
    description: descriptions[params.locale] ?? descriptions.en,
    alternates: {
      canonical: `https://www.artnowdatabase.eu/${params.locale}/map`,
      languages: {
        en: "https://www.artnowdatabase.eu/en/map",
        fr: "https://www.artnowdatabase.eu/fr/map",
        nl: "https://www.artnowdatabase.eu/nl/map",
      },
    },
  };
}

export default async function MapPage({ params, searchParams }: PageProps) {
  const { locations, exhibitions } = await getMapData();

  const locale = params.locale;
  const initialCity =
    typeof searchParams?.city === "string" ? searchParams.city : "";

  const headings: Record<string, string> = {
    en: "Art exhibitions on the map",
    fr: "Les expositions d'art sur la carte",
    nl: "Kunsttentoonstellingen op de kaart",
  };

  const titles: Record<string, string> = {
    en: "Art Exhibitions Map – Museums & Galleries in Europe",
    fr: "Carte des expositions d'art – Musées et galeries en Europe",
    nl: "Kaart met kunsttentoonstellingen – Musea en galeries in Europa",
  };

  const descriptions: Record<string, string> = {
    en: "Discover current and upcoming art exhibitions across Europe. Explore museums and galleries on an interactive map, or search by city to find exhibitions near you.",
    fr: "Découvrez les expositions d'art en cours et à venir en Europe. Explorez les musées et galeries sur une carte interactive ou recherchez une ville.",
    nl: "Ontdek actuele en toekomstige kunsttentoonstellingen in Europa. Verken musea en galeries op een interactieve kaart of zoek op stad.",
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="mb-3 text-2xl font-light text-slate-700">
          {headings[locale] ?? headings.en}
        </h1>
        <p className="max-w-3xl text-sm text-slate-600">
          {descriptions[locale] ?? descriptions.en}
        </p>
      </header>

      <MapClient
        locations={locations}
        exhibitions={exhibitions}
        locale={locale}
        initialCity={initialCity}
      />

      <nav className="mt-8 text-sm text-slate-600">
        <p className="mb-3">Explore exhibitions by:</p>
        <div className="flex gap-6">
          <Link
            href={`/${locale}/exhibitions/cities`}
            className="underline underline-offset-4"
          >
            Cities
          </Link>
          <Link
            href={`/${locale}/exhibitions/locations`}
            className="underline underline-offset-4"
          >
            Locations
          </Link>
        </div>
      </nav>
    </main>
  );
}
