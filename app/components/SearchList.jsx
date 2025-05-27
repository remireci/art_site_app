"use client"
import { useState } from 'react';
import { Search } from "lucide-react";

const SearchList = ({ query, setQuery, onSearch, onClear }) => {
    const [localQuery, setLocalQuery] = useState(query || "");

    const handleChange = (e) => {
        setLocalQuery(e.target.value);
        if (setQuery) setQuery(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSearch(localQuery);
        }
    }

    return (
        <div className="input-container flex flex-row items-end justify-between w-full h-2/3">
            <div className="flex flex-row items-end relative w-full ml-2 text-slate-400">
                <label htmlFor="exhibition-search" className="sr-only">
                    Search query
                </label>
                <input
                    id="exhibition-search"
                    name="exhibition-query"
                    className="w-full h-8 bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
                    type="text"
                    placeholder="artist, city, museum, title..."
                    value={localQuery}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                {localQuery && (
                    <button
                        className="clear-button absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                        onClick={() => {
                            setLocalQuery("");
                            if (setQuery) setQuery("");
                            onClear();
                        }}
                        aria-label="Clear"
                    >
                        x
                    </button>
                )}
            </div>
            <button
                className="w-14 h-8 bg-[#87bdd8] hover:bg-blue-700 text-slate-100 mx-1 rounded-xl flex items-center justify-center"
                onClick={() => onSearch(localQuery)}
                aria-label="Search"

            >
                <Search size={22} strokeWidth={2} />
            </button>
        </div>
    );

}

export default SearchList;