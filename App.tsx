import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ResultsDisplay } from './components/ResultsDisplay';
import { HistoryLog } from './components/HistoryLog';
import { researchAeternum } from './services/geminiService';
import type { Source, HistoryEntry } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
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
      const result = await researchAeternum(searchQuery);
      if (result) {
        setResultText(result.text);
        setSources(result.sources);
        // Add to history, avoiding duplicates of the most recent query
        setHistory(prev => {
          if (prev[0]?.query === searchQuery) return prev;
          return [{ id: Date.now().toString(), query: searchQuery, text: result.text, sources: result.sources }, ...prev];
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
  }, []);

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
      className="min-h-screen bg-cover bg-center bg-fixed text-gray-200 p-4 sm:p-6 lg:p-8"
      style={{ backgroundImage: `url('https://picsum.photos/seed/aeternum/1920/1080')` }}
    >
      <div className="absolute inset-0 bg-slate-900 bg-opacity-80 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-8">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 flex flex-col gap-8">
                <main>
                    <SearchBar 
                        query={query}
                        setQuery={setQuery}
                        onSearch={handleSearch}
                        isLoading={isLoading}
                    />
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
        <footer className="text-center text-xs text-gray-500 mt-8">
            <p>Aeternum Research Tool | Powered by Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
