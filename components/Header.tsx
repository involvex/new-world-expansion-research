
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center border-b-2 border-yellow-500/50 pb-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 tracking-wider">
        Aeternum Research Tool
      </h1>
      <p className="text-sm sm:text-base text-gray-300 mt-2">
        Your AI companion for the New World: Aeternum expansion.
      </p>
    </header>
  );
};
