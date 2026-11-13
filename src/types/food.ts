export type BudgetTier =
  | 'under-15k'
  | '15k-25k'
  | '25k-50k'
  | '50k-100k'
  | 'above-100k';

export interface BudgetOption {
  id: BudgetTier;
  label: string;
  shortLabel: string;
}

export const BUDGET_TIERS: BudgetOption[] = [
  { id: 'under-15k', label: 'Under 15K', shortLabel: '< 15K' },
  { id: '15k-25k', label: '15K–25K', shortLabel: '15K–25K' },
  { id: '25k-50k', label: '25K–50K', shortLabel: '25K–50K' },
  { id: '50k-100k', label: '50K–100K', shortLabel: '50K–100K' },
  { id: 'above-100k', label: 'Above 100K', shortLabel: '> 100K' },
];

export const DEFAULT_CATEGORIES: string[] = [
  'Mie',
  'Ayam',
  'Bakso',
  'Dimsum',
  'Seafood',
  'Japanese food',
  'Korean food',
  'Western food',
  'Dessert',
  'Lainnya',
];

export const FOOD_EMOJIS: string[] = [
  '🍜',
  '🍗',
  '🍲',
  '🥟',
  '🍤',
  '🍣',
  '🍱',
  '🥘',
  '🍔',
  '🍝',
  '🍰',
  '🧋',
  '🍨',
  '🍛',
  '🌮',
  '🍕',
  '🥩',
  '🥞',
  '🍙',
  '🍓',
];

export interface FoodPlace {
  id: string;
  name: string;
  category: string;
  budgetTier: BudgetTier;
  estimatedPriceDetail?: string;
  location: string;
  notes?: string;
  emoji: string;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
  pickedCount: number;
}

export interface DatePickRecord {
  id: string;
  placeId: string;
  placeName: string;
  placeEmoji: string;
  category: string;
  budgetLabel: string;
  location: string;
  pickedAt: number;
}

export type NavTab = 'home' | 'list' | 'roulette' | 'favorites';

export function getBudgetLabel(tier: BudgetTier): string {
  return BUDGET_TIERS.find((b) => b.id === tier)?.label ?? '25K–50K';
}
