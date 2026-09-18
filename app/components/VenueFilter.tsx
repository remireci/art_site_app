"use client";

import { ReactNode, useState } from "react";

import styles from "./VenueFilter.module.css";

type VenueFilterValue = "all" | "museum_institution" | "gallery_art_space";

type Props = {
  children: ReactNode;
  currentCount: number;
  upcomingCount: number;
  pastCount: number;
  showPageNavigation: Boolean;
  showVenueFilters: Boolean;
};

export default function VenueFilter({
  children,
  currentCount,
  upcomingCount,
  pastCount,
  showPageNavigation,
  showVenueFilters,
}: Props) {
  const [filter, setFilter] = useState<VenueFilterValue>("all");

  console.log("show navigation", showPageNavigation);

  return (
    <div className={styles.filter} data-filter={filter}>
      <div className="w-full max-w-3xl mt-10 mb-12 border-y border-gray-200 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showPageNavigation && (
            <nav aria-label="On this page">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                On this page
              </p>

              <div className="flex flex-col gap-2 text-sm">
                <a href="#on-now" className="hover:underline">
                  On now ({currentCount})
                </a>

                {upcomingCount > 0 && (
                  <a href="#coming-soon" className="hover:underline">
                    Coming soon ({upcomingCount})
                  </a>
                )}

                {pastCount > 0 && (
                  <a href="#past-exhibitions" className="hover:underline">
                    Recent past ({pastCount})
                  </a>
                )}
              </div>
            </nav>
          )}

          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
              Browse by venue
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={filter === "all"}
                onClick={() => setFilter("all")}
                className={
                  filter === "all"
                    ? "rounded bg-gray-800 px-3 py-2 text-sm text-white"
                    : "rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                }
              >
                All
              </button>

              <button
                type="button"
                aria-pressed={filter === "museum_institution"}
                onClick={() => setFilter("museum_institution")}
                className={
                  filter === "museum_institution"
                    ? "rounded bg-gray-800 px-3 py-2 text-sm text-white"
                    : "rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                }
              >
                Museums & institutions
              </button>

              <button
                type="button"
                aria-pressed={filter === "gallery_art_space"}
                onClick={() => setFilter("gallery_art_space")}
                className={
                  filter === "gallery_art_space"
                    ? "rounded bg-gray-800 px-3 py-2 text-sm text-white"
                    : "rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                }
              >
                Galleries & art spaces
              </button>
            </div>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
