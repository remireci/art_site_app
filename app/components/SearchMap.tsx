"use client"
import React, { useEffect, useState } from 'react';

interface SearchMapProps {
    query: string;
    setQuery: (query: string) => void;
    onSearch: (query: string) => void;
}

const SearchMap: React.FC<SearchMapProps> = React.memo(({ query, setQuery }) => {
    const [localQuery, setLocalQuery] = useState(query);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setQuery(localQuery); // Only update the main query when searching        
    };

    return (
        <form className="input-container flex flex-row items-end justify-between w-full h-2/3" onSubmit={handleSubmit}>
            <div className="flex flex-row items-end relative w-full ml-2 text-slate-400">
                <input
                    type="text"
                    className="w-full h-8 bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
                    placeholder="Search location..."
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                />
            </div>
            <button
                type="submit"
                className="w-1/5 h-8 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 mx-1 rounded flex items-center justify-center"
            >
                Search
            </button>
        </form>
    );
});

SearchMap.displayName = 'SearchMap';

export default SearchMap;

// interface SearchInputProps {
//     onSearch: (query: string) => void;
//     placeholder?: string;
// }

// const SearchInput: React.FC<SearchInputProps> = ({ onSearch, placeholder = "Search..." }) => {
//     const [query, setQuery] = useState("");

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (query.trim() !== "") {
//             onSearch(query);
//         }
//     };

//     return (
//         <form className="input-container flex flex-row items-end justify-between w-full h-2/3" onSubmit={handleSubmit}>
//             <div className="flex flex-row items-end relative w-full ml-2 text-slate-400">
//                 <input
//                     type="text"
//                     className="w-full h-8 bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
//                     placeholder={placeholder}
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                 />
//             </div>
//             <button
//                 type="submit"
//                 className="w-1/5 h-8 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 mx-1 rounded flex items-center justify-center"
//             >
//                 Search
//             </button>
//         </form>
//     );
// };

// export default SearchInput;
