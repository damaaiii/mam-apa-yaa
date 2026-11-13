import React from 'react';
import { Disc3, Heart, Home, Plus, Utensils } from 'lucide-react';
import { NavTab } from '../types/food';
import { RibbonBow } from './Doodles';

interface NavbarProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onOpenAddModal: () => void;
  favoritesCount: number;
  placesCount: number;
}

const NAV_ITEMS: { id: NavTab; label: string; mobileLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', mobileLabel: 'Home', icon: Home },
  { id: 'list', label: 'My Food List', mobileLabel: 'Food List', icon: Utensils },
  { id: 'roulette', label: 'Food Roulette', mobileLabel: 'Roulette', icon: Disc3 },
  { id: 'favorites', label: 'Favorites', mobileLabel: 'Favorites', icon: Heart },
];

export function Navbar({
  activeTab,
  onNavigate,
  onOpenAddModal,
  favoritesCount,
  placesCount,
}: NavbarProps) {
  return (
    <>
      {/* Desktop & Tablet Top Bar (3-zone contract) */}
      <header className="sticky top-0 z-30 bg-[#FFF9FA]/90 backdrop-blur-md border-b border-[#F5D8E2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 md:h-16 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8527B] rounded-lg px-1 py-1 cursor-pointer"
          >
            <RibbonBow className="w-6 h-4 text-[#C8527B] shrink-0" />
            <span className="font-display text-base sm:text-lg font-semibold tracking-tight text-[#3E202C]">
              What to Eat with Mas?
            </span>
          </button>

          {/* Zone 2: Clean Typography Nav Links (Desktop & Tablet) */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`relative py-1.5 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8527B] rounded ${
                    isActive
                      ? 'text-[#AA3B63] font-semibold'
                      : 'text-[#6B4454] hover:text-[#3E202C]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.id === 'list' && placesCount > 0 && (
                    <span className="ml-1.5 text-xs text-[#8D6676] tabular-nums">
                      ({placesCount})
                    </span>
                  )}
                  {item.id === 'favorites' && favoritesCount > 0 && (
                    <span className="ml-1.5 text-xs text-[#C8527B] tabular-nums">
                      ({favoritesCount})
                    </span>
                  )}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-[#C8527B]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center justify-center gap-1.5 min-h-[38px] md:min-h-[40px] px-3.5 md:px-4 py-1.5 rounded-xl bg-[#C8527B] hover:bg-[#AA3B63] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-[#C8527B]/20 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C8527B]"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add Place</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation (One-handed thumb zone) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF9FA]/95 backdrop-blur-md border-t border-[#F5D8E2] shadow-[0_-4px_20px_rgba(200,82,123,0.06)]"
      >
        <div className="grid grid-cols-4 items-center h-14 px-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center justify-center min-h-[44px] w-full rounded-xl transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8527B] ${
                  isActive ? 'text-[#AA3B63]' : 'text-[#8D6676] hover:text-[#3E202C]'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-150 ${
                      isActive ? 'scale-105 stroke-[2.3]' : 'stroke-[1.8]'
                    } ${item.id === 'favorites' && isActive ? 'fill-[#FFE4EC]' : ''}`}
                  />
                  {item.id === 'favorites' && favoritesCount > 0 && (
                    <span className="ml-0.5 text-[10px] font-bold text-[#C8527B] tabular-nums">
                      {favoritesCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-0.5 whitespace-nowrap leading-none ${
                    isActive ? 'font-bold' : 'font-medium'
                  }`}
                >
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
