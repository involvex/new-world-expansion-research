import React, { useState, useEffect } from 'react';
import type { TradeskillCalculation, Tradeskill, Resource } from '../types';
import { calculateTradeskillRequirements, exportTradeskillData } from '../services/tradeskillService';

interface TradeskillCalculatorProps {
  onClose: () => void;
}

export const TradeskillCalculator: React.FC<TradeskillCalculatorProps> = ({ onClose }) => {
  const [calculation, setCalculation] = useState<TradeskillCalculation | null>(null);
  const [selectedTradeskill, setSelectedTradeskill] = useState<string | null>(null);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [filterRarity, setFilterRarity] = useState<string>('all');

  useEffect(() => {
    const data = calculateTradeskillRequirements();
    setCalculation(data);
  }, []);

  const handleExport = () => {
    if (!calculation) return;
    
    const data = exportTradeskillData(calculation);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `night-haven-tradeskill-requirements-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const handleExportCSV = () => {
    if (!calculation) return;
    
    let csv = 'Tradeskill,Resource,Quantity,Rarity,Source,Estimated Value\n';
    
    calculation.tradeskills.forEach(tradeskill => {
      tradeskill.totalResources.forEach(resource => {
        csv += `${tradeskill.name},${resource.name},${resource.quantity},${resource.rarity},${resource.source},${resource.estimatedValue || 0}\n`;
      });
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `night-haven-tradeskill-requirements-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-300';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-300';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-700';
      case 'uncommon': return 'bg-green-900';
      case 'rare': return 'bg-blue-900';
      case 'epic': return 'bg-purple-900';
      case 'legendary': return 'bg-yellow-900';
      default: return 'bg-gray-700';
    }
  };

  const filteredResources = (resources: Resource[]) => {
    if (filterRarity === 'all') return resources;
    return resources.filter(r => r.rarity === filterRarity);
  };

  if (!calculation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-slate-800 p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4">Calculating tradeskill requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Night Haven Tradeskill Calculator</h2>
            <p className="text-gray-400">Resource requirements for leveling all tradeskills 250-300</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="p-6 border-b border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Total Tradeskills</h3>
              <p className="text-2xl font-bold text-blue-400">{calculation.tradeskills.length}</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Total Resources</h3>
              <p className="text-2xl font-bold text-green-400">{calculation.totalResources.length}</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Estimated Cost</h3>
              <p className="text-2xl font-bold text-yellow-400">{calculation.totalEstimatedCost.toLocaleString()} gold</p>
            </div>
          </div>
        </div>

        <div className="flex h-[60vh]">
          {/* Tradeskill List */}
          <div className="w-1/3 border-r border-slate-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Tradeskills</h3>
              <div className="space-y-2">
                {calculation.tradeskills.map((tradeskill) => (
                  <button
                    key={tradeskill.name}
                    onClick={() => setSelectedTradeskill(tradeskill.name)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTradeskill === tradeskill.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{tradeskill.icon}</span>
                      <div>
                        <div className="font-semibold">{tradeskill.name}</div>
                        <div className="text-sm text-gray-400">
                          {tradeskill.estimatedCost.toLocaleString()} gold
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resource Details */}
          <div className="flex-1 overflow-y-auto">
            {selectedTradeskill ? (
              <div className="p-4">
                {(() => {
                  const tradeskill = calculation.tradeskills.find(t => t.name === selectedTradeskill);
                  if (!tradeskill) return null;

                  return (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">
                          {tradeskill.icon} {tradeskill.name}
                        </h3>
                        <div className="text-lg text-yellow-400">
                          {tradeskill.estimatedCost.toLocaleString()} gold
                        </div>
                      </div>

                      {/* Rarity Filter */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Filter by Rarity:
                        </label>
                        <select
                          value={filterRarity}
                          onChange={(e) => setFilterRarity(e.target.value)}
                          className="bg-slate-700 text-white border border-slate-600 rounded-md px-3 py-1"
                        >
                          <option value="all">All Rarities</option>
                          <option value="common">Common</option>
                          <option value="uncommon">Uncommon</option>
                          <option value="rare">Rare</option>
                          <option value="epic">Epic</option>
                          <option value="legendary">Legendary</option>
                        </select>
                      </div>

                      {/* Resources List */}
                      <div className="space-y-2">
                        {filteredResources(tradeskill.totalResources).map((resource, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg ${getRarityBg(resource.rarity)}`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className={`font-semibold ${getRarityColor(resource.rarity)}`}>
                                  {resource.name}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {resource.source} • {resource.rarity}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-white">
                                  {resource.quantity.toLocaleString()}
                                </div>
                                {resource.estimatedValue && (
                                  <div className="text-sm text-yellow-400">
                                    {(resource.quantity * resource.estimatedValue).toLocaleString()} gold
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">⚔️</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Tradeskill</h3>
                  <p className="text-gray-400">Choose a tradeskill from the list to view detailed resource requirements</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export Success Message */}
        {showExportSuccess && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg">
            Export successful!
          </div>
        )}
      </div>
    </div>
  );
};