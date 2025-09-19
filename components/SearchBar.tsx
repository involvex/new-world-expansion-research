import React from 'react';
import { SearchIcon } from './icons';

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

export const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch, isLoading }) => {
  const handleSearchClick = () => {
    onSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-600/50">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSearchClick()}
          placeholder="e.g., 'What's the new level cap?'"
          className="flex-grow bg-slate-900/80 border border-gray-500 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
          disabled={isLoading}
        />
        <button
          onClick={handleSearchClick}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-2 px-6 rounded-md hover:bg-teal-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-200 shadow-md"
        >
          <SearchIcon />
          {isLoading ? 'Researching...' : 'Research'}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-400 mr-2 self-center">Try:</span>
        {suggestionQueries.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isLoading}
            className="text-xs bg-slate-700/70 text-gray-300 px-3 py-1 rounded-full hover:bg-slate-600 disabled:opacity-50 transition duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};