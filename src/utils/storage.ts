import { DatePickRecord, DEFAULT_CATEGORIES, FoodPlace } from '../types/food';

const PLACES_STORAGE_KEY = 'wtewm_places_v1';
const CATEGORIES_STORAGE_KEY = 'wtewm_categories_v1';
const DEALS_STORAGE_KEY = 'wtewm_deals_v1';

export function loadPlaces(): FoodPlace[] {
  try {
    const raw = localStorage.getItem(PLACES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function savePlaces(places: FoodPlace[]): void {
  try {
    localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(places));
  } catch {
    // Ignore storage quota errors safely
  }
}

export function loadCategories(): string[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) return [...DEFAULT_CATEGORIES];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [...DEFAULT_CATEGORIES];
    }
    return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  } catch {
    return [...DEFAULT_CATEGORIES];
  }
}

export function saveCategories(categories: string[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch {
    // Ignore storage errors safely
  }
}

export function loadDeals(): DatePickRecord[] {
  try {
    const raw = localStorage.getItem(DEALS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveDeals(deals: DatePickRecord[]): void {
  try {
    localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(deals));
  } catch {
    // Ignore storage errors safely
  }
}

/**
 * Generates a cryptographically uniform random integer in [0, max - 1]
 * using rejection sampling to avoid modulo bias.
 */
export function getTrueRandomIndex(max: number): number {
  if (max <= 1) return 0;
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    const limit = Math.floor(0xffffffff / max) * max;
    let rand: number;
    do {
      window.crypto.getRandomValues(array);
      rand = array[0];
    } while (rand >= limit);
    return rand % max;
  }
  return Math.floor(Math.random() * max);
}

export function generateId(): string {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `place_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
