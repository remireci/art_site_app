"use client";

import type { FormEvent } from "react";
import { Search, X } from "lucide-react";

interface SearchListProps {
  query: string;
  setQuery: (value: string) => void;
  onSearch: (value: string) => void;
  onClear: () => void;
}

export default function SearchList({
  query,
  setQuery,
  onSearch,
  onClear,
}: SearchListProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex w-full items-center gap-2"
    >
      <div className="relative min-w-0 flex-1">
        <label htmlFor="exhibition-search" className="sr-only">
          Search exhibitions
        </label>

        <input
          id="exhibition-search"
          type="text"
          name="exhibition-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="artist, city, museum, title..."
          className="h-9 w-full rounded border border-slate-300 bg-slate-50 px-3 pr-9 text-sm text-slate-700 placeholder:text-slate-300 focus:border-orange-400 focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <button
        type="submit"
        aria-label="Search"
        className="
    flex h-9 w-12 shrink-0 items-center justify-center
    rounded-lg bg-[#b8d8e8] text-[#31556b]
    transition-colors duration-200
    hover:bg-[#87bdd8] hover:text-[#9ba2a5]
    focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-[#87bdd8]
  "
      >
        <Search size={20} />
      </button>
    </form>
  );
}
