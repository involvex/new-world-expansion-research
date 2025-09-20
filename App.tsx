/// <reference types="vite/client" />

import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ResultsDisplay } from './components/ResultsDisplay';
import { HistoryLog } from './components/HistoryLog';
import { HotkeyOverview } from './components/HotkeyOverview';
import { researchAeternum } from './services/geminiService';
import type { Source, HistoryEntry } from './types';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>(import.meta.env.VITE_API_KEY || '');
  const [resultText, setResultText] = useState<string>('');
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showShareSuccess, setShowShareSuccess] = useState<boolean>(false);
  const [showHotkeyOverview, setShowHotkeyOverview] = useState<boolean>(false);

  const handleShare = useCallback(async (text: string, sources: Source[]) => {
    const githubRepoLink = "https://github.com/involvex/new-world-expansion-research";
    let shareText = `Aeternum Research Tool Results:\n\n${text}\n\n`;

    if (sources.length > 0) {
      shareText += "Sources:\n";
      sources.forEach((source, index) => {
        shareText += `${index + 1}. ${source.web?.title || source.web?.uri}\n`;
      });
      shareText += `\nRead more at: ${githubRepoLink}`;
    } else {
      shareText += `Read more at: ${githubRepoLink}`;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 3000); // Hide after 3 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Optionally, show an error message to the user
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return; // Ignore if modifier keys are pressed

      switch (event.key) {
        case 'g': // Open GitHub repository
        case 'G':
          window.open("https://github.com/involvex/new-world-expansion-research", "_blank");
          break;
        case 'r': // Refresh page
        case 'R':
          window.location.reload();
          break;
        case 'd': // Download data (as JSON for now)
        case 'D':
          if (resultText) {
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `aeternum-research-${timestamp}.json`;
            const data = { text: resultText, sources: sources };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
          break;
        case 's': // Share Research (to clipboard for Discord)
        case 'S':
          if (resultText) {
            handleShare(resultText, sources);
          }
          break;
        case '?': // Toggle Hotkey overview
          setShowHotkeyOverview(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resultText, sources, handleShare]);

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
                        onShare={handleShare}
                        showShareSuccess={showShareSuccess}
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
            <a href="https://github.com/involvex/new-world-expansion-research" target="_blank" rel="noopener noreferrer"><p>Aeternum Research Tool | Created by Involvex </p></a>
            <p>Researched with Aeternum Research Tool</p>
            <p className="mt-2 text-gray-400">Press &#39; ? &#39; for Hotkeys</p>
            <br />
            <a href="https://www.buymeacoffee.com/involvex" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style={{ height: '40px', width: '135px', 'textAlign': 'center', 'marginLeft': '42%'}} ></img>
            </a>
        </footer>
      </div>
      {showHotkeyOverview && <HotkeyOverview onClose={() => setShowHotkeyOverview(false)} />}
    </div>
  );
};
