import React from 'react';
import type { Source } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { LinkIcon, ResearchDeeperIcon } from './icons';

interface ResultsDisplayProps {
  text: string;
  sources: Source[];
  isLoading: boolean;
  error: string | null;
  onResearchDeeper: (query: string) => void;
}

const SourceLink: React.FC<{ source: Source }> = ({ source }) => (
    <a
      href={source.web.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm bg-slate-700/50 p-2 rounded-md hover:bg-slate-600/50 transition duration-200"
    >
      <LinkIcon />
      <span className="truncate text-teal-300 hover:text-teal-200">{source.web.title || new URL(source.web.uri).hostname}</span>
    </a>
);

const ResultItem: React.FC<{ line: string; onResearchDeeper: (query: string) => void }> = ({ line, onResearchDeeper }) => {
    const isListItem = /^\s*([-*]|\d+\.)\s/.test(line);
    // Remove markdown list markers and trim whitespace
    const content = line.replace(/^\s*([-*]|\d+\.)\s/, '').trim();

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


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ text, sources, isLoading, error, onResearchDeeper }) => {
  if (isLoading) {
    return (
      <div className="mt-6 p-6 bg-slate-800/50 backdrop-blur-md rounded-lg shadow-lg border border-gray-600/50 flex flex-col items-center justify-center min-h-[20rem]">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-yellow-400">Consulting the Ancients...</p>
        <p className="text-sm text-gray-400">Searching the aether for knowledge.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-6 bg-red-900/50 rounded-lg border border-red-500/50">
        <h3 className="text-lg font-bold text-red-300">An Error Occurred</h3>
        <p className="text-red-200 mt-2">{error}</p>
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
  
  const contentLines = text.split('\n');

  return (
    <div className="mt-6 p-6 bg-slate-800/50 backdrop-blur-md rounded-lg shadow-lg border border-gray-600/50">
      <div className="prose prose-invert prose-p:my-0 prose-headings:text-yellow-400 prose-a:text-teal-400 hover:prose-a:text-teal-300 prose-strong:text-gray-100 max-w-none">
        <h2 className="text-2xl font-bold mb-4">Research Findings</h2>
        {contentLines.map((line, index) => (
          <ResultItem key={index} line={line} onResearchDeeper={onResearchDeeper} />
        ))}
      </div>
      
      {sources.length > 0 && (
        <div className="mt-8 pt-4 border-t border-gray-600/50">
          <h3 className="text-xl font-bold mb-4 text-yellow-400">Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sources.map((source, index) => (
              <SourceLink key={`${source.web.uri}-${index}`} source={source} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
