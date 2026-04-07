"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type LocationItem = {
  _id?: string;
  id?: string;
  domain_slug: string;
  name: string;
  exhibitionsCount?: number;
};

type LocationListSearchProps = {
  locations: LocationItem[];
  locale: string;
  placeholder?: string;
  noResultsText?: string;
};

export default function LocationListSearch({
  locations,
  locale,
  placeholder = "Search a location",
  noResultsText = "No locations found.",
}: LocationListSearchProps) {
  const [query, setQuery] = useState("");

  const filteredLocations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations;

    return locations.filter((location) =>
      location.name?.toLowerCase().includes(q),
    );
  }, [locations, query]);

  return (
    <section className="w-full max-w-5xl">
      <div className="mb-8">
        <label htmlFor="location-search" className="sr-only">
          Search a location
        </label>
        <input
          id="location-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
        />
      </div>

      {filteredLocations.length === 0 ? (
        <p className="text-sm text-slate-500">{noResultsText}</p>
      ) : (
        <nav aria-label="Locations">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.map((location) => (
              <li key={location._id || location.id || location.domain_slug}>
                <Link
                  href={`/${locale}/exhibitions/locations/${location.domain_slug}`}
                  className="flex min-h-[56px] items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-700 transition hover:bg-slate-50 hover:underline"
                >
                  <span className="text-slate-600">{location.name}</span>
                  {typeof location.exhibitionsCount === "number" && (
                    <span className="ml-3 text-sm text-slate-400">
                      {location.exhibitionsCount}
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
