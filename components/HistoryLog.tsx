import React from "react";
import type { HistoryEntry } from "../types";
import { HistoryIcon } from "./icons";

interface HistoryLogProps {
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onClear: () => void;
  isLoading: boolean;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({
  history,
  onRestore,
  onClear,
  isLoading,
}) => {
  if (history.length === 0) {
    return (
      <aside className="bg-slate-800/50 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-600/50 h-fit text-center text-gray-400">
        <h2 className="text-xl font-bold text-yellow-400 flex items-center justify-center gap-2 mb-4">
          <HistoryIcon />
          Research Log
        </h2>
        <p className="text-sm">Your past searches will be stored here.</p>
      </aside>
    );
  }

  return (
    <aside className="bg-slate-800/50 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-600/50 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
          <HistoryIcon />
          Research Log
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-red-400 transition"
          aria-label="Clear research log"
        >
          Clear
        </button>
      </div>
      <ul className="space-y-2 max-h-[32rem] overflow-y-auto pr-2">
        {history.map((entry) => (
          <li key={entry.id}>
            <button
              onClick={() => onRestore(entry)}
              disabled={isLoading}
              className="w-full text-left text-sm text-gray-300 bg-slate-700/50 p-2 rounded-md hover:bg-slate-600/50 disabled:opacity-50 transition duration-200 truncate"
              title={entry.query}
            >
              {entry.query}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
