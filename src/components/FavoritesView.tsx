import React, { useMemo, useState } from 'react';
import { Disc3, Heart, Search, Utensils } from 'lucide-react';
import { FoodPlace, NavTab } from '../types/food';
import { HeartDoodle } from './Doodles';
import { PlaceCard } from './PlaceCard';

interface FavoritesViewProps {
  places: FoodPlace[];
  onToggleFavorite: (id: string) => void;
  onEditPlace: (place: FoodPlace) => void;
  onDeletePlace: (id: string) => void;
  onSpinFavorites: () => void;
  onNavigate: (tab: NavTab) => void;
}

export function FavoritesView({
  places,
  onToggleFavorite,
  onEditPlace,
  onDeletePlace,
  onSpinFavorites,
  onNavigate,
}: FavoritesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const favoritePlaces = useMemo(
    () => places.filter((p) => p.isFavorite),
    [places]
  );

  const filteredFavorites = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return favoritePlaces;
    return favoritePlaces.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }, [favoritePlaces, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#AA3B63] mb-1">
            <HeartDoodle className="w-3.5 h-3.5 text-[#C8527B]" />
            <span>Tempat Andalan Kalian</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#3E202C]">
            Favorites
          </h1>
          <p className="text-sm text-[#6B4454] mt-1 tabular-nums">
            {favoritePlaces.length === 0
              ? 'Belum ada tempat yang ditandai dengan hati.'
              : `${favoritePlaces.length} tempat favorit tersimpan.`}
          </p>
        </div>

        {favoritePlaces.length > 0 && (
          <button
            type="button"
            onClick={onSpinFavorites}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C8527B] hover:bg-[#AA3B63] text-white text-sm font-semibold inline-flex items-center gap-2 shadow-sm shadow-[#C8527B]/20 cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <Disc3 className="w-4 h-4" />
            <span>Spin dari Favorit!</span>
          </button>
        )}
      </div>

      {favoritePlaces.length === 0 ? (
        <section className="rounded-3xl bg-white border border-[#F5D8E2] p-8 sm:p-12 text-center shadow-[0_6px_28px_rgba(200,82,123,0.05)]">
          <div className="max-w-sm mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF2F5] border border-[#FFE4EC] flex items-center justify-center mb-5">
              <Heart className="w-8 h-8 text-[#C8527B]" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#3E202C]">
              Belum ada tempat favorit nih ♡
            </h2>
            <p className="text-sm text-[#6B4454] mt-2 leading-relaxed">
              Ketuk ikon hati pada tempat makan yang paling kalian suka di My Food List agar mudah ditemukan di sini.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('list')}
              className="mt-6 min-h-[46px] px-6 py-2.5 rounded-2xl bg-[#C8527B] hover:bg-[#AA3B63] text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Utensils className="w-4 h-4" />
              <span>Buka My Food List</span>
            </button>
          </div>
        </section>
      ) : (
        <>
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#8D6676] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari di tempat favorit..."
              aria-label="Cari di tempat favorit"
              className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-white border border-[#F0CCD8] text-sm text-[#3E202C] placeholder:text-[#B58999] focus:outline-none focus:ring-2 focus:ring-[#C8527B]"
            />
          </div>

          {filteredFavorites.length === 0 ? (
            <div className="rounded-3xl bg-white border border-[#F5D8E2] p-8 text-center">
              <p className="text-sm text-[#6B4454]">
                Tidak ada favorit yang cocok dengan &ldquo;{searchQuery}&rdquo;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFavorites.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onToggleFavorite={onToggleFavorite}
                  onEdit={onEditPlace}
                  onDelete={onDeletePlace}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
