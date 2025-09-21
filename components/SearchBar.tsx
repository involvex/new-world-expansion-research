import React from "react";
import { SearchIcon } from "./icons";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const suggestionQueries = [
  "How to prepare for Nighthaven release?",
  "What are the new features in the expansion?",
  "Best builds for Nighthaven endgame?",
  "Changes to crafting and gathering?",
];

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  onSearch,
  isLoading,
}) => {
  const handleSearchClick = () => {
    onSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-slate-800/50 backdrop-blur-md border-gray-600/50">
      <label
        htmlFor="query"
        className="block mb-2 text-sm font-medium text-gray-300"
      >
        Research Query
      </label>
      <div className="flex flex-col gap-4 sm:flex-row">
        <input
          id="query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !isLoading && handleSearchClick()
          }
          placeholder="e.g., 'What's the new level cap?'"
          className="flex-grow px-4 py-2 text-gray-200 transition duration-200 border border-gray-500 rounded-md bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSearchClick}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-6 py-2 font-bold text-white transition duration-200 bg-teal-600 rounded-md shadow-md hover:bg-teal-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <SearchIcon />
          {isLoading ? "Researching..." : "Research"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="self-center mr-2 text-sm text-gray-400">Try:</span>
        {suggestionQueries.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isLoading}
            className="px-3 py-1 text-xs text-gray-300 transition duration-200 rounded-full bg-slate-700/70 hover:bg-slate-600 disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
