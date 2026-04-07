"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type CityItem = {
  id?: string;
  _id?: string;
  slug: string;
  city: string;
  exhibitionsCount?: number;
};

type CityListSearchProps = {
  cities: CityItem[];
  locale: string;
  placeholder?: string;
  noResultsText?: string;
};

export default function CityListSearch({
  cities,
  locale,
  placeholder = "Search a city",
  noResultsText = "No cities found.",
}: CityListSearchProps) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCities = useMemo(() => {
    if (!normalizedQuery) return cities;

    return cities.filter((city) =>
      city.city?.toLowerCase().includes(normalizedQuery),
    );
  }, [cities, normalizedQuery]);

  return (
    <section className="w-full max-w-4xl">
      <div className="mb-8">
        <label htmlFor="city-search" className="sr-only">
          Search a city
        </label>
        <input
          id="city-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-slate-300 px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
        />
      </div>

      {filteredCities.length === 0 ? (
        <p className="text-sm text-slate-500">{noResultsText}</p>
      ) : (
        <nav aria-label="Cities">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCities.map((city) => (
              <li key={city._id || city.id || city.slug}>
                <Link
                  href={`/${locale}/exhibitions/cities/${city.slug}`}
                  className="block rounded-md border border-slate-200 px-4 py-3 text-slate-700 transition hover:bg-slate-50 hover:underline"
                >
                  <span>{city.city}</span>
                  {typeof city.exhibitionsCount === "number" && (
                    <span className="ml-2 text-sm text-slate-400">
                      ({city.exhibitionsCount})
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}
