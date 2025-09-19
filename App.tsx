/// <reference types="vite/client" />

import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ResultsDisplay } from './components/ResultsDisplay';
import { HistoryLog } from './components/HistoryLog';
import { researchAeternum } from './services/geminiService';
import type { Source, HistoryEntry } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>(import.meta.env.VITE_API_KEY || '');
  const [resultText, setResultText] = useState<string>('');
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter a research query.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultText('');
    setSources([]);
    setQuery(searchQuery); // Set query when search starts

    try {
      const result = await researchAeternum(searchQuery, apiKey || undefined);
      if (result && result.text) {
        setResultText(result.text);
        setSources(result.sources);
        // Add to history, avoiding duplicates of the most recent query
        setHistory(prev => {
          if (prev[0]?.query === searchQuery) return prev;
          return [{ id: Date.now().toString(), query: searchQuery, text: result.text as string, sources: result.sources }, ...prev];
        });
      } else {
         setError('No response from the research AI. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching research data. Please check the console and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const handleRestoreHistory = useCallback((entry: HistoryEntry) => {
    setQuery(entry.query);
    setResultText(entry.text);
    setSources(entry.sources);
    setError(null);
    setIsLoading(false);
    // Scroll to top to see the restored result
    window.scrollTo(0, 0);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <div 
      className="min-h-screen p-4 text-gray-200 bg-fixed bg-center bg-cover sm:p-6 lg:p-8"
      style={{ backgroundImage: `url('https://picsum.photos/seed/aeternum/1920/1080')` }}
    >
      <div className="absolute inset-0 bg-slate-900 bg-opacity-80 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col gap-8 mx-auto max-w-7xl">
        <Header />
        <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-8 lg:col-span-2">
                <main>
                    <SearchBar 
                        query={query}
                        setQuery={setQuery}
                        onSearch={handleSearch}
                        isLoading={isLoading}
                    />
                    <div className="mb-4">
                        <label htmlFor="apiKey" className="block mb-2 text-sm font-medium text-gray-300">
                          Gemini API Key (required)
                        </label>
                        <input
                          id="apiKey"
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Enter your Gemini API key"
                          className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    <ResultsDisplay 
                        text={resultText}
                        sources={sources}
                        isLoading={isLoading}
                        error={error}
                        onResearchDeeper={handleSearch}
                    />
                </main>
            </div>
            <div className="lg:col-span-1">
                <HistoryLog 
                    history={history}
                    onRestore={handleRestoreHistory}
                    onClear={handleClearHistory}
                    isLoading={isLoading}
                />
            </div>
        </div>
        <footer className="mt-8 text-xs text-center text-gray-500">
            <p>Aeternum Research Tool | Powered by Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
