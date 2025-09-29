export interface Source {
  web: {
    uri: string;
    title: string;
  };
}

export interface HistoryEntry {
  id: string;
  query: string;
  text: string;
  sources: Source[];
}

// Tradeskill Calculator Types
export interface Resource {
  name: string;
  quantity: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  source: string;
  estimatedValue?: number;
}

export interface TradeskillLevel {
  level: number;
  experienceRequired: number;
  recipes: Recipe[];
}

export interface Recipe {
  name: string;
  level: number;
  experience: number;
  resources: Resource[];
  category: string;
}

export interface Tradeskill {
  name: string;
  icon: string;
  levels: TradeskillLevel[];
  totalResources: Resource[];
  estimatedCost: number;
}

export interface TradeskillCalculation {
  tradeskills: Tradeskill[];
  totalResources: Resource[];
  totalEstimatedCost: number;
  expansion: string;
}
