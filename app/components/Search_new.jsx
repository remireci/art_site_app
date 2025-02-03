"use client";
import { useState } from "react";
import SearchInput from "./SearchInput";
import SearchTabs from "./SearchTabs";
import SearchResults from "./SearchResults";
import LoadingIndicator from "./LoadingIndicator";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  const handleSearch = async (searchQuery) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/search?terms=${searchQuery}`);
      const { data = [] } = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <SearchInput query={query} setQuery={setQuery} onSearch={handleSearch} />
      <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {loading ? (
        <LoadingIndicator />
      ) : (
        <SearchResults results={results} view={activeTab} query={query} />
      )}
    </div>
  );
};

export default Search;
