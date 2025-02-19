"use client"
import { useState } from 'react';

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
                <input
                    className="w-full h-8 bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
                    type="text"
                    placeholder="artist, city, museum, title..."
                    value={localQuery}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                {localQuery && (
                    <button
                        className="clear-button absolute right-8 top-1"
                        onClick={() => {
                            setLocalQuery("");
                            if (setQuery) setQuery("");
                            onClear();
                        }}
                    >
                        x
                    </button>
                )}
            </div>
            <button
                className="w-1/5 h-8 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 mx-1 rounded flex items-center justify-center"
                onClick={() => onSearch(localQuery)}
            >
                Search
            </button>
        </div>
    );

}

export default SearchList;