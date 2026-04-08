import Link from "next/link";
import { Metadata } from "next";
import { SEO_CITY_HUB_LINKS } from "@/data/city-seo-config";

export const metadata: Metadata = {
  title: "Art exhibitions in Europe | Curated city pages",
  description:
    "Explore curated city pages for modern and contemporary art exhibitions in Europe.",
};

export default function ArtExhibitionsInEuropePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  return (
    <main className="min-h-screen mt-20 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-semibold text-gray-800">
          Art exhibitions in Europe
        </h1>

        <p className="mt-4 max-w-3xl text-gray-700">
          Explore curated pages for modern and contemporary art exhibitions in
          selected European cities. These pages offer a quick overview of
          current and upcoming shows, with links to full city listings and map
          search.
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {SEO_CITY_HUB_LINKS.map((city) => (
            <li
              key={city.route}
              className="rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <Link
                href={`/${locale}/${city.route}`}
                className="text-lg text-blue-700 hover:underline"
              >
                {city.label}
              </Link>
              <p className="mt-2 text-sm text-gray-600">
                Current and upcoming exhibitions in {city.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
