"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { formatDate } from "@/utils/formatDate";
import SearchList from "./SearchList";
import ImageDisplay from "./ImageDisplay";
import GetLocation from "./GetLocation";
import AdsColumn from "./AdsColumn";
import { shuffleArray } from "../utils/shuffleArray";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

import type { ComponentProps } from "react";

import type { MapLocation, ExhibitionGroup } from "@/lib/map/getMapData";

import type { SearchResult } from "@/types/search";

const MosaicTab = dynamic(() => import("./MosaicTab"), {
  ssr: false,
  loading: () => (
    <div className="text-center py-10 text-gray-500">Loading Mosaic...</div>
  ),
});

interface SearchProps {
  initialList: SearchResult[];
  initialLocations: MapLocation[];
  exhibitions: ExhibitionGroup[];
  locale: string;
  ads: ComponentProps<typeof AdsColumn>["ads"];
}

const Search = ({
  initialList,
  initialLocations,
  exhibitions,
  locale,
  ads,
}: SearchProps) => {
  const t = useTranslations("homepage");
  type ActiveTab = "list" | "mosaic";

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>(initialList);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("list");

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const requestId = useRef<number>(0);
  const latestQuery = useRef<string>(query);

  const locations = initialLocations;

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://www.artnowdatabase.eu"
      : "http://localhost:3000";
  // const ads = [{ src: "/test_gif.gif", name: "" }, { src: "250516MR_MetropolisM_500kb.gif", name: "" }, { src: "AP_Ad_MM-1.gif", name: "" }]

  // useEffect(() => {
  //   numberOfLoads.current += 1;
  //   console.log(
  //     "Initial data loaded via SSR. Number of loads:",
  //     numberOfLoads.current,
  //   );
  //   // console.log("Initial data loaded via SSR:", initialList);
  // }, []);

  // const handleInputChange = (e) => {
  //   const inputValue = e.target.value;
  //   setQuery(inputValue);
  //   setShowClearButton(inputValue.trim() !== "");
  // };

  const handleClear = () => {
    setQuery("");
    setResults(initialList);
    setInitialLoad(true);
    setLoading(false);

    abortController.current?.abort();
    requestId.current += 1;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
  };

  const handleSearch = useCallback(
    async (searchTerm: string): Promise<void> => {
      const term = searchTerm.trim();

      // Cancel any pending debounced search
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }

      // Cancel any previous request
      abortController.current?.abort();

      // Invalidate previous responses
      const currentRequestId = ++requestId.current;

      if (!term) {
        setResults(initialList);
        setInitialLoad(true);
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      abortController.current = controller;

      setInitialLoad(false);
      setLoading(true);

      try {
        const response = await fetch(
          `/api/search?terms=${encodeURIComponent(term)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const responseData: unknown = await response.json();

        if (
          typeof responseData !== "object" ||
          responseData === null ||
          !("data" in responseData) ||
          !Array.isArray(responseData.data)
        ) {
          throw new Error("Unexpected search response format");
        }

        const data = responseData.data as SearchResult[];

        setResults(data);

        const articles = data.filter(
          (result: SearchResult) => result.source === "articles",
        );

        localStorage.setItem("articles", JSON.stringify(articles));

        localStorage.setItem("articles", JSON.stringify(articles));
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Error searching:", error);
      } finally {
        if (currentRequestId === requestId.current) {
          setLoading(false);
        }
      }
    },
    [initialList],
  );

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    latestQuery.current = query;

    // Cancel a pending debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }

    // Invalidate and cancel searches for older queries
    abortController.current?.abort();
    requestId.current += 1;
    setLoading(false);

    if (!query.trim()) {
      setResults(initialList);
      setInitialLoad(true);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
    };
  }, [query, handleSearch, initialList]);

  // // Function to highlight the query text within the snippet and limit the length of the snippet
  // const highlightQuery = (snippet, query) => {
  //   if (!query) return snippet; // Return the snippet as is if the query is empty

  //   const maxSnippetLength = 400; // Maximum length of the snippet
  //   const queryIndex = snippet.toLowerCase().indexOf(query.toLowerCase()); // Find the index of the query text in the snippet

  //   if (queryIndex === -1) return snippet; // Return the snippet as is if the query is not found

  //   // Calculate the start and end indices for the substring around the query text
  //   let startIndex = Math.max(0, queryIndex - 200);
  //   let endIndex = Math.min(snippet.length, queryIndex + query.length + 200);

  //   // Ensure that the snippet length does not exceed the maximum length
  //   if (endIndex - startIndex > maxSnippetLength) {
  //     // Adjust the start index to maintain the maximum length
  //     startIndex = Math.max(0, endIndex - maxSnippetLength);
  //   }

  //   // Extract the substring around the query text and highlight the query text
  //   const trimmedSnippet = snippet.substring(startIndex, endIndex);
  //   const regex = new RegExp(query, "gi"); // Create a case-insensitive regular expression for the query
  //   const highlightedSnippet = trimmedSnippet.replace(
  //     regex,
  //     "<strong>$&</strong>",
  //   ); // Wrap matched query text with <strong> tags

  //   return startIndex > 0 ? `...${highlightedSnippet}...` : highlightedSnippet;
  // };

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-3 xl:grid-cols-5">
      {/* Reserved for desktop introduction */}
      <div className="hidden xl:block" aria-hidden="true" />

      {/* Search and exhibition results */}
      <section className="min-w-0 px-2 md:col-span-2 md:px-3 lg:pt-16 xl:col-span-2">
        {/* Search input */}
        <div className="mb-4 w-full">
          <SearchList
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>

        {/* View selection */}
        {/* <div className="mb-5 flex justify-center gap-6">
          <button
            type="button"
            onClick={() => handleTabChange("list")}
            aria-pressed={activeTab === "list"}
            className={`rounded px-3 py-1 text-sm ${
              activeTab === "list"
                ? "bg-slate-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-slate-300"
            }`}
          >
            {t("list")}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("mosaic")}
            aria-pressed={activeTab === "mosaic"}
            className={`rounded px-3 py-1 text-sm ${
              activeTab === "mosaic"
                ? "bg-slate-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-slate-300"
            }`}
          >
            {t("mosaic")}
          </button>
        </div> */}

        <div className="mb-4 flex justify-center">
          <div className="inline-flex rounded-md border border-slate-200 bg-slate-100 p-0.5">
            {(["list", "mosaic"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                aria-pressed={activeTab === tab}
                className={`rounded px-5 py-1.5 text-xs transition-colors ${
                  activeTab === tab
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>
        </div>
        <div id="results-container" className="results-container min-w-0">
          {loading && (
            <p role="status" className="mb-2 text-right text-xs text-slate-400">
              Searching...
            </p>
          )}
          <>
            {activeTab === "mosaic" && (
              <div className="w-full rounded bg-slate-200 p-4">
                <Suspense fallback={null}>
                  <MosaicTab
                    // activeTab={activeTab}
                    exhibitions={exhibitions}
                  />
                </Suspense>
              </div>
            )}

            {activeTab === "list" &&
              results &&
              results.filter((result) => result.source === "agenda").length >
                0 && (
                <ul className="w-full bg-slate-50 z-5 p-4 rounded text-xs">
                  <div>
                    {initialLoad && (
                      <p className="text-center text-xs font-light italic text-slate-400 tracking-widest mb-4">
                        {t("glimpse")}
                      </p>
                    )}
                  </div>
                  {results
                    .filter(
                      (
                        result,
                      ): result is SearchResult & { date_end_st: string } =>
                        result.source === "agenda" &&
                        typeof result.date_end_st === "string",
                    )
                    .map((result, index) => {
                      // Helper function to ensure URL is correctly formatted
                      const formatUrl = (url: string) => {
                        if (
                          !url.startsWith("http://") &&
                          !url.startsWith("https://")
                        ) {
                          return `https://www.${url}`;
                        }
                        return url;
                      };

                      // Format the URLs
                      // const exhibitionUrl = result.exhibition_url && result.exhibition_url !== 'N/A' && /^https?:\/\//.test(result.exhibition_url) ? formatUrl(result.exhibition_url) : null;
                      // exhibition_url from AgendaAI can be an array. TODO in the futur it will always be a string, so we can go back to former code. (line above)
                      // const rawUrl = Array.isArray(result.exhibition_url)
                      //   ? result.exhibition_url[0]
                      //   : result.exhibition_url;

                      // const exhibitionUrl =
                      //   rawUrl &&
                      //   rawUrl !== "N/A" &&
                      //   /^https?:\/\//.test(rawUrl)
                      //     ? formatUrl(rawUrl)
                      //     : null;

                      // const locationUrl = formatUrl(result.url);

                      // Ensure image_reference is valid and correctly formatted
                      const priorityOrder = ["jpg", "jpeg", "png", "svg"];

                      const images = Array.isArray(result.image_reference)
                        ? [...result.image_reference]
                        : typeof result.image_reference === "string"
                          ? [result.image_reference]
                          : [];

                      const getExtensionPriority = (url: string): number => {
                        const extension = url
                          .split(/[?#]/)[0]
                          .split(".")
                          .pop()
                          ?.toLowerCase();

                        const index = priorityOrder.indexOf(extension ?? "");

                        return index === -1 ? Infinity : index;
                      };

                      images.sort(
                        (a, b) =>
                          getExtensionPriority(a) - getExtensionPriority(b),
                      );

                      let imagePath = images[0] ?? "";

                      if (imagePath.endsWith("?")) {
                        imagePath = imagePath.slice(0, -1);
                      }

                      if (imagePath.startsWith("https://")) {
                        imagePath = `${imagePath}?width=100&height=50&fit=cover`;
                      }

                      const location = locations.find(
                        (loc) => loc.domain === result.domain,
                      );

                      const slug = location?.domain_slug;

                      const URL = slug
                        ? `${BASE_URL}/${locale}/exhibitions/locations/${slug}`
                        : result.url || "#";

                      const isEven = index % 2 === 0;

                      return (
                        <li
                          key={index}
                          className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between"
                        >
                          {isEven ? (
                            // For even index: Text on the left, image on the right
                            <>
                              <div className="flex-1">
                                <a
                                  href={URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 block text-sm italic"
                                >
                                  {`${result.title}`}
                                  {result.artists &&
                                    result.artists !== "N/A" && (
                                      <span>{` - ${result.artists}`}</span>
                                    )}
                                </a>
                                <p className="mt-2 text-sm">
                                  &#8702;{" "}
                                  {formatDate(result.date_end_st, locale)}
                                </p>
                                <a
                                  href={URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 text-sm block sm:inline"
                                >
                                  {`in ${result.location}`}
                                </a>
                              </div>
                              <a
                                href={URL}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div
                                  className="relative mt-2 sm:mt-0 sm:ml-4 flex-shrink-0 before:absolute before:top-[0px] before:left-0 before:-translate-x-52 before:w-48 before:h-[1px] before:bg-gray-400"
                                  style={{ width: "160px", height: "160px" }}
                                >
                                  <ImageDisplay
                                    imagePath={imagePath}
                                    title={result.title}
                                    priority={index < 2}
                                  />
                                </div>
                              </a>
                            </>
                          ) : (
                            // For odd index: Image on the left, text on the right
                            <>
                              <a
                                href={URL}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div
                                  className="relative mt-2 sm:mt-0 sm:mr-4 flex-shrink-0 before:absolute before:top-[0px] before:right-0 before:translate-x-52 before:w-48 before:h-[1px] before:bg-gray-400"
                                  style={{ width: "160px", height: "160px" }}
                                >
                                  <ImageDisplay
                                    imagePath={imagePath}
                                    title={result.title}
                                    priority={index < 2}
                                  />
                                </div>
                              </a>
                              <div className="flex-1 text-right">
                                <a
                                  href={URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 block text-sm italic"
                                >
                                  {`${result.title}`}
                                  {result.artists &&
                                    result.artists !== "N/A" && (
                                      <span>{` - ${result.artists}`}</span>
                                    )}
                                </a>
                                <p className="mt-2 text-sm">
                                  &#8702;{" "}
                                  {formatDate(result.date_end_st, locale)}
                                </p>
                                <a
                                  href={URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 text-sm block sm:inline"
                                >
                                  {`in ${result.location}`}
                                </a>
                              </div>
                            </>
                          )}
                        </li>
                      );
                    })}
                </ul>
              )}
            {/* Show message if no results */}
            {results && results.length === 0 && !initialLoad && (
              <p className="mx-4 mt-8">No results found.</p>
            )}
          </>
        </div>
      </section>

      <aside className="ads-container flex min-w-0 flex-col items-center md:col-span-1 xl:col-span-2">
        <AdsColumn ads={ads} />
      </aside>
    </div>
  );
};

export default Search;
