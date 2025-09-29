import type { Tradeskill, TradeskillCalculation, Resource, Recipe, TradeskillLevel } from '../types';

// Night Haven Tradeskill Data (250-300)
const NIGHT_HAVEN_TRADESKILL_DATA: Record<string, Tradeskill> = {
  'weaponsmithing': {
    name: 'Weaponsmithing',
    icon: '⚔️',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'armoring': {
    name: 'Armoring',
    icon: '🛡️',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'engineering': {
    name: 'Engineering',
    icon: '🔧',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'jewelcrafting': {
    name: 'Jewelcrafting',
    icon: '💎',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'arcana': {
    name: 'Arcana',
    icon: '🔮',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'cooking': {
    name: 'Cooking',
    icon: '🍳',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'furnishing': {
    name: 'Furnishing',
    icon: '🪑',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'smelting': {
    name: 'Smelting',
    icon: '🔥',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'weaving': {
    name: 'Weaving',
    icon: '🧵',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'leatherworking': {
    name: 'Leatherworking',
    icon: '🦌',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'woodworking': {
    name: 'Woodworking',
    icon: '🪵',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'stonecutting': {
    name: 'Stonecutting',
    icon: '⛏️',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'logging': {
    name: 'Logging',
    icon: '🪓',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'mining': {
    name: 'Mining',
    icon: '⛏️',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'fishing': {
    name: 'Fishing',
    icon: '🎣',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'harvesting': {
    name: 'Harvesting',
    icon: '🌾',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  },
  'tracking': {
    name: 'Tracking',
    icon: '🦌',
    levels: [],
    totalResources: [],
    estimatedCost: 0
  }
};

// Experience requirements for levels 250-300 (estimated based on New World patterns)
const EXPERIENCE_REQUIREMENTS: Record<number, number> = {
  250: 0,
  251: 50000,
  252: 55000,
  253: 60000,
  254: 65000,
  255: 70000,
  256: 75000,
  257: 80000,
  258: 85000,
  259: 90000,
  260: 95000,
  261: 100000,
  262: 105000,
  263: 110000,
  264: 115000,
  265: 120000,
  266: 125000,
  267: 130000,
  268: 135000,
  269: 140000,
  270: 145000,
  271: 150000,
  272: 155000,
  273: 160000,
  274: 165000,
  275: 170000,
  276: 175000,
  277: 180000,
  278: 185000,
  279: 190000,
  280: 195000,
  281: 200000,
  282: 205000,
  283: 210000,
  284: 215000,
  285: 220000,
  286: 225000,
  287: 230000,
  288: 235000,
  289: 240000,
  290: 245000,
  291: 250000,
  292: 255000,
  293: 260000,
  294: 265000,
  295: 270000,
  296: 275000,
  297: 280000,
  298: 285000,
  299: 290000,
  300: 295000
};

// Generate recipes for each tradeskill level
function generateRecipesForLevel(tradeskill: string, level: number): Recipe[] {
  const recipes: Recipe[] = [];
  
  // Base experience per recipe (varies by tradeskill)
  const baseExp = getBaseExperienceForTradeskill(tradeskill);
  const expRequired = EXPERIENCE_REQUIREMENTS[level] - EXPERIENCE_REQUIREMENTS[level - 1];
  const recipesNeeded = Math.ceil(expRequired / baseExp);
  
  for (let i = 0; i < recipesNeeded; i++) {
    recipes.push(generateRecipe(tradeskill, level));
  }
  
  return recipes;
}

function getBaseExperienceForTradeskill(tradeskill: string): number {
  const expMap: Record<string, number> = {
    'weaponsmithing': 1200,
    'armoring': 1200,
    'engineering': 1000,
    'jewelcrafting': 1500,
    'arcana': 1300,
    'cooking': 800,
    'furnishing': 1000,
    'smelting': 600,
    'weaving': 800,
    'leatherworking': 1000,
    'woodworking': 900,
    'stonecutting': 700,
    'logging': 500,
    'mining': 500,
    'fishing': 400,
    'harvesting': 400,
    'tracking': 500
  };
  
  return expMap[tradeskill] || 1000;
}

function generateRecipe(tradeskill: string, level: number): Recipe {
  const recipeName = `${tradeskill.charAt(0).toUpperCase() + tradeskill.slice(1)} Recipe L${level}`;
  const baseExp = getBaseExperienceForTradeskill(tradeskill);
  const experience = baseExp + (level - 250) * 50; // Slight increase per level
  
  return {
    name: recipeName,
    level,
    experience,
    resources: generateResourcesForRecipe(tradeskill, level),
    category: getCategoryForTradeskill(tradeskill)
  };
}

function getCategoryForTradeskill(tradeskill: string): string {
  const categoryMap: Record<string, string> = {
    'weaponsmithing': 'Weapon Crafting',
    'armoring': 'Armor Crafting',
    'engineering': 'Engineering',
    'jewelcrafting': 'Jewelry',
    'arcana': 'Magic Items',
    'cooking': 'Food & Drink',
    'furnishing': 'Furniture',
    'smelting': 'Refining',
    'weaving': 'Textiles',
    'leatherworking': 'Leather Goods',
    'woodworking': 'Wood Items',
    'stonecutting': 'Stone Items',
    'logging': 'Gathering',
    'mining': 'Gathering',
    'fishing': 'Gathering',
    'harvesting': 'Gathering',
    'tracking': 'Gathering'
  };
  
  return categoryMap[tradeskill] || 'General';
}

function generateResourcesForRecipe(tradeskill: string, level: number): Resource[] {
  const resources: Resource[] = [];
  
  // Base resource requirements increase with level
  const baseQuantity = 5 + Math.floor((level - 250) / 5);
  
  // Generate resources based on tradeskill type
  switch (tradeskill) {
    case 'weaponsmithing':
      resources.push(
        { name: 'Iron Ingot', quantity: baseQuantity * 2, rarity: 'common', source: 'Smelting', estimatedValue: 2 },
        { name: 'Steel Ingot', quantity: baseQuantity, rarity: 'uncommon', source: 'Smelting', estimatedValue: 8 },
        { name: 'Starmetal Ingot', quantity: Math.ceil(baseQuantity / 2), rarity: 'rare', source: 'Smelting', estimatedValue: 25 }
      );
      break;
      
    case 'armoring':
      resources.push(
        { name: 'Linen', quantity: baseQuantity * 3, rarity: 'common', source: 'Weaving', estimatedValue: 1 },
        { name: 'Sateen', quantity: baseQuantity * 2, rarity: 'uncommon', source: 'Weaving', estimatedValue: 5 },
        { name: 'Silk', quantity: baseQuantity, rarity: 'rare', source: 'Weaving', estimatedValue: 15 }
      );
      break;
      
    case 'engineering':
      resources.push(
        { name: 'Timber', quantity: baseQuantity * 2, rarity: 'common', source: 'Woodworking', estimatedValue: 2 },
        { name: 'Lumber', quantity: baseQuantity, rarity: 'uncommon', source: 'Woodworking', estimatedValue: 8 },
        { name: 'Iron Ingot', quantity: baseQuantity, rarity: 'common', source: 'Smelting', estimatedValue: 2 }
      );
      break;
      
    case 'jewelcrafting':
      resources.push(
        { name: 'Silver Ore', quantity: baseQuantity * 2, rarity: 'uncommon', source: 'Mining', estimatedValue: 5 },
        { name: 'Gold Ore', quantity: baseQuantity, rarity: 'rare', source: 'Mining', estimatedValue: 20 },
        { name: 'Platinum Ore', quantity: Math.ceil(baseQuantity / 2), rarity: 'epic', source: 'Mining', estimatedValue: 50 }
      );
      break;
      
    case 'arcana':
      resources.push(
        { name: 'Lifebloom', quantity: baseQuantity * 3, rarity: 'common', source: 'Harvesting', estimatedValue: 1 },
        { name: 'Mote of Life', quantity: baseQuantity * 2, rarity: 'uncommon', source: 'Arcana', estimatedValue: 5 },
        { name: 'Essence of Life', quantity: baseQuantity, rarity: 'rare', source: 'Arcana', estimatedValue: 15 }
      );
      break;
      
    case 'cooking':
      resources.push(
        { name: 'Raw Meat', quantity: baseQuantity * 2, rarity: 'common', source: 'Tracking', estimatedValue: 1 },
        { name: 'Herbs', quantity: baseQuantity * 2, rarity: 'common', source: 'Harvesting', estimatedValue: 1 },
        { name: 'Seasoning', quantity: baseQuantity, rarity: 'uncommon', source: 'Cooking', estimatedValue: 3 }
      );
      break;
      
    case 'furnishing':
      resources.push(
        { name: 'Timber', quantity: baseQuantity * 3, rarity: 'common', source: 'Woodworking', estimatedValue: 2 },
        { name: 'Lumber', quantity: baseQuantity * 2, rarity: 'uncommon', source: 'Woodworking', estimatedValue: 8 },
        { name: 'Iron Ingot', quantity: baseQuantity, rarity: 'common', source: 'Smelting', estimatedValue: 2 }
      );
      break;
      
    case 'smelting':
      resources.push(
        { name: 'Iron Ore', quantity: baseQuantity * 3, rarity: 'common', source: 'Mining', estimatedValue: 1 },
        { name: 'Coal', quantity: baseQuantity * 2, rarity: 'common', source: 'Mining', estimatedValue: 1 }
      );
      break;
      
    case 'weaving':
      resources.push(
        { name: 'Fiber', quantity: baseQuantity * 3, rarity: 'common', source: 'Harvesting', estimatedValue: 1 },
        { name: 'Hemp', quantity: baseQuantity * 2, rarity: 'common', source: 'Harvesting', estimatedValue: 1 }
      );
      break;
      
    case 'leatherworking':
      resources.push(
        { name: 'Rawhide', quantity: baseQuantity * 3, rarity: 'common', source: 'Tracking', estimatedValue: 1 },
        { name: 'Thick Hide', quantity: baseQuantity * 2, rarity: 'uncommon', source: 'Tracking', estimatedValue: 3 },
        { name: 'Iron Hide', quantity: baseQuantity, rarity: 'rare', source: 'Tracking', estimatedValue: 10 }
      );
      break;
      
    case 'woodworking':
      resources.push(
        { name: 'Green Wood', quantity: baseQuantity * 3, rarity: 'common', source: 'Logging', estimatedValue: 1 },
        { name: 'Aged Wood', quantity: baseQuantity * 2, rarity: 'uncommon', source: 'Logging', estimatedValue: 3 },
        { name: 'Wyrdwood', quantity: baseQuantity, rarity: 'rare', source: 'Logging', estimatedValue: 8 }
      );
      break;
      
    case 'stonecutting':
      resources.push(
        { name: 'Stone', quantity: baseQuantity * 3, rarity: 'common', source: 'Mining', estimatedValue: 1 },
        { name: 'Stone Block', quantity: baseQuantity * 2, rarity: 'uncommon', source: 'Stonecutting', estimatedValue: 3 }
      );
      break;
      
    // Gathering skills have different resource patterns
    case 'logging':
    case 'mining':
    case 'fishing':
    case 'harvesting':
    case 'tracking':
      resources.push(
        { name: 'Basic Tools', quantity: 1, rarity: 'common', source: 'Engineering', estimatedValue: 10 },
        { name: 'Consumables', quantity: baseQuantity, rarity: 'common', source: 'Cooking', estimatedValue: 2 }
      );
      break;
  }
  
  return resources;
}

// Initialize tradeskill data
function initializeTradeskillData(): Record<string, Tradeskill> {
  const tradeskills = { ...NIGHT_HAVEN_TRADESKILL_DATA };
  
  Object.keys(tradeskills).forEach(tradeskillKey => {
    const tradeskill = tradeskills[tradeskillKey];
    const levels: TradeskillLevel[] = [];
    const allResources: Resource[] = [];
    let totalCost = 0;
    
    // Generate levels 251-300
    for (let level = 251; level <= 300; level++) {
      const recipes = generateRecipesForLevel(tradeskillKey, level);
      const levelResources: Resource[] = [];
      
      recipes.forEach(recipe => {
        levelResources.push(...recipe.resources);
      });
      
      levels.push({
        level,
        experienceRequired: EXPERIENCE_REQUIREMENTS[level],
        recipes
      });
      
      // Aggregate resources
      levelResources.forEach(resource => {
        const existingResource = allResources.find(r => r.name === resource.name);
        if (existingResource) {
          existingResource.quantity += resource.quantity;
        } else {
          allResources.push({ ...resource });
        }
      });
    }
    
    // Calculate total cost
    allResources.forEach(resource => {
      if (resource.estimatedValue) {
        totalCost += resource.quantity * resource.estimatedValue;
      }
    });
    
    tradeskill.levels = levels;
    tradeskill.totalResources = allResources;
    tradeskill.estimatedCost = totalCost;
  });
  
  return tradeskills;
}

export const calculateTradeskillRequirements = (): TradeskillCalculation => {
  const tradeskills = initializeTradeskillData();
  const tradeskillArray = Object.values(tradeskills);
  
  // Aggregate all resources across all tradeskills
  const totalResources: Resource[] = [];
  let totalEstimatedCost = 0;
  
  tradeskillArray.forEach(tradeskill => {
    totalEstimatedCost += tradeskill.estimatedCost;
    
    tradeskill.totalResources.forEach(resource => {
      const existingResource = totalResources.find(r => r.name === resource.name);
      if (existingResource) {
        existingResource.quantity += resource.quantity;
      } else {
        totalResources.push({ ...resource });
      }
    });
  });
  
  return {
    tradeskills: tradeskillArray,
    totalResources,
    totalEstimatedCost,
    expansion: 'Night Haven'
  };
};

export const getTradeskillByName = (name: string): Tradeskill | null => {
  const tradeskills = initializeTradeskillData();
  return tradeskills[name.toLowerCase()] || null;
};

export const exportTradeskillData = (calculation: TradeskillCalculation): string => {
  const data = {
    expansion: calculation.expansion,
    totalEstimatedCost: calculation.totalEstimatedCost,
    tradeskills: calculation.tradeskills.map(t => ({
      name: t.name,
      icon: t.icon,
      estimatedCost: t.estimatedCost,
      totalResources: t.totalResources
    })),
    totalResources: calculation.totalResources
  };
  
  return JSON.stringify(data, null, 2);
};