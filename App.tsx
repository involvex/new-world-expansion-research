/// <reference types="vite/client" />

import React, { useState, useCallback, useEffect } from "react";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { ResultsDisplay } from "./components/ResultsDisplay";
import { HistoryLog } from "./components/HistoryLog";
import { HotkeyOverview } from "./components/HotkeyOverview";
import { researchAeternum } from "./services/geminiService";
import type { Source, HistoryEntry } from "./types";
import "./App.css";
// import 'vitest-preview';
// import { debug } from 'vitest-preview';

// debug();

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [resultText, setResultText] = useState<string>("");
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showShareSuccess, setShowShareSuccess] = useState<boolean>(false);
  const [showHotkeyOverview, setShowHotkeyOverview] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");

  const handleShare = useCallback(async (text: string, sources: Source[]) => {
    const githubRepoLink =
      "https://github.com/involvex/new-world-expansion-research";
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
        case "g": // Open GitHub repository
        case "G":
          window.open(
            "https://github.com/involvex/new-world-expansion-research",
            "_blank",
          );
          break;
        case "r": // Refresh page
        case "R":
          window.location.reload();
          break;
        case "d": // Download data (as JSON for now)
        case "D":
          if (resultText) {
            const timestamp = new Date().toISOString().split("T")[0];
            const filename = `aeternum-research-${timestamp}.json`;
            const data = { text: resultText, sources: sources };
            const blob = new Blob([JSON.stringify(data, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
          break;
        case "s": // Share Research (to clipboard for Discord)
        case "S":
          if (resultText) {
            handleShare(resultText, sources);
          }
          break;
        case "?": // Toggle Hotkey overview
          setShowHotkeyOverview((prev) => !prev);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [resultText, sources, handleShare]);

  // Load API key from local storage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("geminiApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setError("Please enter a research query.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setResultText("");
      setSources([]);
      setQuery(searchQuery); // Set query when search starts

      try {
        if (!apiKey) {
          setError("Please enter your Gemini API Key to perform research.");
          setIsLoading(false);
          return;
        }
        const result = await researchAeternum({ query: searchQuery, apiKey }); // Pass apiKey to the service
        if (result && result.text) {
          setResultText(result.text);
          setSources(result.sources);
          // Add to history, avoiding duplicates of the most recent query
          setHistory((prev) => {
            if (prev[0]?.query === searchQuery) return prev;
            return [
              {
                id: Date.now().toString(),
                query: searchQuery,
                text: result.text as string,
                sources: result.sources,
              },
              ...prev,
            ];
          });
        } else {
          setError("No response from the research AI. Please try again.");
        }
      } catch (err) {
        console.error(err);
        setError(
          "An error occurred while fetching research data. Please check the console and try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey],
  );
  const handleSaveApiKey = useCallback(() => {
    localStorage.setItem("geminiApiKey", apiKey);
    alert("API Key saved!"); // Simple feedback
  }, [apiKey]);

  const handleClearApiKey = useCallback(() => {
    localStorage.removeItem("geminiApiKey");
    setApiKey("");
    alert("API Key cleared!"); // Simple feedback
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
    <div className="min-h-screen p-4 text-gray-200 bg-fixed bg-center bg-cover sm:p-6 lg:p-8 app-background">
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
          <div className="flex flex-col gap-8 lg:col-span-1">
            <HistoryLog
              history={history}
              onRestore={handleRestoreHistory}
              onClear={handleClearHistory}
              isLoading={isLoading}
            />
            {/* New API Key Management Section */}
            <div className="p-4 rounded-lg shadow-lg bg-slate-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-100">
                Gemini API Key
              </h3>
              <label
                htmlFor="gemini-api-key"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Enter your Gemini API Key:
              </label>
              <form className="flex gap-2">
                <input
                  type="password"
                  id="gemini-api-key"
                  className="flex-grow p-2 text-gray-100 border rounded-md bg-slate-700 border-slate-600 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  autoComplete="off"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                  Save
                </button>
                <button
                  onClick={handleClearApiKey}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                  Clear
                </button>
              </form>
              {apiKey && (
                <p className="mt-3 text-sm text-green-400">
                  API Key loaded. (First 4 chars: {apiKey.substring(0, 4)}...)
                </p>
              )}
              {!apiKey && (
                <p className="mt-3 text-sm text-yellow-400">
                  No API Key set. Please enter one to use the service.
                </p>
              )}
            </div>
          </div>
        </div>
        <footer className="mt-8 text-xs text-center text-gray-500">
          <a
            href="https://github.com/involvex/new-world-expansion-research"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p>Aeternum Research Tool | Created by Involvex </p>
          </a>
          <p>Researched with Aeternum Research Tool</p>
          <p className="mt-2 text-gray-400">Press &#39; ? &#39; for Hotkeys</p>
          <br />
          <a
            href="https://www.buymeacoffee.com/involvex"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
              alt="Buy Me A Coffee"
              className="bmc-button"
            ></img>
          </a>
        </footer>
      </div>
      {showHotkeyOverview && (
        <HotkeyOverview onClose={() => setShowHotkeyOverview(false)} />
      )}
    </div>
  );
};
