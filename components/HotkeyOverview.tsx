import React from "react";

interface HotkeyOverviewProps {
  onClose: () => void;
}

export const HotkeyOverview: React.FC<HotkeyOverviewProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative p-8 bg-slate-800 rounded-lg shadow-xl max-w-md w-full text-gray-200 border border-gray-600">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          Hotkey Overview
        </h2>
        <ul className="space-y-2">
          <li>
            <span className="font-bold text-teal-300">G</span>: Open GitHub
            Repository
          </li>
          <li>
            <span className="font-bold text-teal-300">R</span>: Refresh
            Application
          </li>
          <li>
            <span className="font-bold text-teal-300">D</span>: Download
            Research Data (JSON)
          </li>
          <li>
            <span className="font-bold text-teal-300">S</span>: Share Research
            Results (to clipboard)
          </li>
          <li>
            <span className="font-bold text-teal-300">?</span>: Toggle Hotkey
            Overview
          </li>
        </ul>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Close
        </button>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          aria-label="Close hotkey overview"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
