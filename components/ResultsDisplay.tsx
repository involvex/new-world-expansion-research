import React from "react";
import type { Source } from "../types";
import { LoadingSpinner } from "./LoadingSpinner";
import { LinkIcon, ResearchDeeperIcon, DownloadIcon, ShareIcon } from "./icons";

interface ResultsDisplayProps {
  text: string;
  sources: Source[];
  isLoading: boolean;
  error: string | null;
  onResearchDeeper: (query: string) => void;
  onShare: (text: string, sources: Source[]) => void;
  showShareSuccess: boolean;
}

const SourceLink: React.FC<{ source: Source }> = ({ source }) => (
  <a
    href={source.web.uri}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 p-2 text-sm transition duration-200 rounded-md bg-slate-700/50 hover:bg-slate-600/50"
  >
    <LinkIcon />
    <span className="text-teal-300 truncate hover:text-teal-200">
      {source.web.title || new URL(source.web.uri).hostname}
    </span>
  </a>
);

const ResultItem: React.FC<{
  line: string;
  onResearchDeeper: (query: string) => void;
}> = ({ line, onResearchDeeper }) => {
  const isListItem = /^\s*([-*]|\d+\.)\s/.test(line);
  // Remove markdown list markers and trim whitespace
  const content = line.replace(/^\s*([-*]|\d+\.)\s/, "").trim();

  if (!content) return <div className="h-4" />; // Render a small gap for empty lines to preserve paragraph breaks

  return (
    <div className="group flex justify-between items-start gap-2 py-0.5">
      <p className="flex-grow">{content}</p>
      {isListItem && (
        <button
          onClick={() => onResearchDeeper(content)}
          className="flex-shrink-0 flex items-center gap-1.5 text-xs bg-teal-800/50 text-teal-300 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
          aria-label={`Research deeper into: ${content}`}
        >
          <ResearchDeeperIcon />
          Deeper
        </button>
      )}
    </div>
  );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  text,
  sources,
  isLoading,
  error,
  onResearchDeeper,
  onShare,
  showShareSuccess,
}) => {
  const handleDownload = () => {
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `aeternum-research-${timestamp}.md`;

    let content = `# Aeternum Research Findings\n\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n\n`;
    content += `## Research Results\n\n${text}\n\n`;

    if (sources.length > 0) {
      content += `## Sources\n\n`;
      sources.forEach((source, index) => {
        content += `${index + 1}. [${source.web.title || new URL(source.web.uri).hostname}](${source.web.uri})\n`;
      });
    }

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="mt-6 p-6 bg-slate-800/50 backdrop-blur-md rounded-lg shadow-lg border border-gray-600/50 flex flex-col items-center justify-center min-h-[20rem]">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-yellow-400">
          Consulting the Ancients...
        </p>
        <p className="text-sm text-gray-400">
          Searching the aether for knowledge.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mt-6 border rounded-lg bg-red-900/50 border-red-500/50">
        <h3 className="text-lg font-bold text-red-300">An Error Occurred</h3>
        <p className="mt-2 text-red-200">{error}</p>
      </div>
    );
  }

  if (!text) {
    return (
      <div className="mt-6 p-6 bg-slate-800/50 backdrop-blur-md rounded-lg shadow-lg border border-gray-600/50 text-center text-gray-400 min-h-[20rem] flex items-center justify-center">
        <p>Your research results will appear here.</p>
      </div>
    );
  }

  const contentLines = text.split("\n");

  return (
    <div className="p-6 mt-6 border rounded-lg shadow-lg bg-slate-800/50 backdrop-blur-md border-gray-600/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Research Findings</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onShare(text, sources)}
            className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Share research findings"
          >
            <ShareIcon />
            Share
            {showShareSuccess && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                Copied!
              </span>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition duration-200 bg-teal-600 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            title="Download research findings as Markdown"
          >
            <DownloadIcon />
            Download
          </button>
        </div>
      </div>
      <div className="prose prose-invert prose-p:my-0 prose-headings:text-yellow-400 prose-a:text-teal-400 hover:prose-a:text-teal-300 prose-strong:text-gray-100 max-w-none">
        {contentLines.map((line, index) => (
          <ResultItem
            key={index}
            line={line}
            onResearchDeeper={onResearchDeeper}
          />
        ))}
      </div>

      {sources.length > 0 && (
        <div className="pt-4 mt-8 border-t border-gray-600/50">
          <h3 className="mb-4 text-xl font-bold text-yellow-400">Sources</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {sources.map((source, index) => (
              <SourceLink key={`${source.web.uri}-${index}`} source={source} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
