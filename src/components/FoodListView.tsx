import React, { useMemo, useState } from 'react';
import { Plus, RotateCcw, Search, SlidersHorizontal, Tags } from 'lucide-react';
import emptyPlateIllustration from '../assets/images/cute_empty_plate_1794531181364.jpg';
import { BUDGET_TIERS, BudgetTier, FoodPlace } from '../types/food';
import { ResilientImage, SparkleDoodle } from './Doodles';
import { PlaceCard } from './PlaceCard';

interface FoodListViewProps {
  places: FoodPlace[];
  categories: string[];
  onOpenAddModal: () => void;
  onOpenEditModal: (place: FoodPlace) => void;
  onDeletePlace: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenCategoryManager: () => void;
}

export function FoodListView({
  places,
  categories,
  onOpenAddModal,
  onOpenEditModal,
  onDeletePlace,
  onToggleFavorite,
  onOpenCategoryManager,
}: FoodListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier | 'ALL'>('ALL');

  const filteredPlaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return places.filter((place) => {
      if (selectedCategory !== 'ALL' && place.category !== selectedCategory) {
        return false;
      }
      if (selectedBudget !== 'ALL' && place.budgetTier !== selectedBudget) {
        return false;
      }
      if (!q) return true;
      return (
        place.name.toLowerCase().includes(q) ||
        place.location.toLowerCase().includes(q) ||
        place.category.toLowerCase().includes(q) ||
        (place.notes && place.notes.toLowerCase().includes(q))
      );
    });
  }, [places, searchQuery, selectedCategory, selectedBudget]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'ALL' ||
    selectedBudget !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedBudget('ALL');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#AA3B63] mb-1">
            <SparkleDoodle className="w-3.5 h-3.5 text-[#E58BA6]" />
            <span>Koleksi Tempat Makan Berdua</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-semibold text-[#3E202C]">
            My Places
          </h1>
          <p className="text-sm text-[#6B4454] mt-1 tabular-nums">
            {places.length === 0
              ? 'Belum ada tempat makan yang ditambahkan.'
              : `${places.length} tempat makan tersimpan di browser ini.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCategoryManager}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-[#FFF2F5] border border-[#F0CCD8] text-xs sm:text-sm font-semibold text-[#6B4454] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Tags className="w-4 h-4 text-[#C8527B]" />
            <span>Kelola Kategori</span>
          </button>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C8527B] hover:bg-[#AA3B63] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-sm shadow-[#C8527B]/20 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tempat</span>
          </button>
        </div>
      </div>

      {/* Empty State when no places added at all */}
      {places.length === 0 ? (
        <section className="rounded-3xl bg-white border border-[#F5D8E2] p-8 sm:p-12 text-center shadow-[0_6px_28px_rgba(200,82,123,0.05)]">
          <div className="max-w-sm mx-auto flex flex-col items-center">
            <div className="w-44 h-44 rounded-3xl overflow-hidden border border-[#FFE4EC] bg-[#FFF9FA] mb-6">
              <ResilientImage
                src={emptyPlateIllustration}
                alt="Ilustrasi piring keramik pastel dengan sumpit berpita pink"
                className="w-full h-full object-cover"
                fallbackTitle="Your food list is still empty!"
              />
            </div>

            <h2 className="font-display text-2xl font-semibold text-[#3E202C]">
              Your food list is still empty!
            </h2>
            <p className="text-sm sm:text-base text-[#6B4454] mt-2">
              Yuk, tambahkan tempat makan favorit kalian ♡
            </p>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="mt-6 min-h-[48px] px-6 py-3 rounded-2xl bg-[#C8527B] hover:bg-[#AA3B63] active:scale-[0.98] text-white font-semibold text-sm inline-flex items-center gap-2 shadow-sm shadow-[#C8527B]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tempat Makan Pertama</span>
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* Search & Filters Bar */}
          <section
            aria-label="Cari dan filter tempat makan"
            className="rounded-2xl bg-white border border-[#F5D8E2] p-4 sm:p-5 space-y-4 shadow-[0_2px_12px_rgba(200,82,123,0.03)]"
          >
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8D6676] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama tempat, lokasi, kategori, atau catatan..."
                  aria-label="Cari tempat makan"
                  className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-[#FFF9FA] border border-[#F0CCD8] text-sm text-[#3E202C] placeholder:text-[#B58999] focus:outline-none focus:ring-2 focus:ring-[#C8527B]"
                />
              </div>

              {/* Budget filter dropdown */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C8527B] shrink-0 hidden sm:block" />
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value as BudgetTier | 'ALL')}
                  aria-label="Filter budget"
                  className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FFF9FA] border border-[#F0CCD8] text-sm font-medium text-[#3E202C] focus:outline-none focus:ring-2 focus:ring-[#C8527B]"
                >
                  <option value="ALL">Semua Budget</option>
                  {BUDGET_TIERS.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#C8527B] text-white'
                    : 'bg-[#FFF2F5] text-[#6B4454] hover:bg-[#FFE4EC]'
                }`}
              >
                Semua kategori
              </button>
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#C8527B] text-white'
                        : 'bg-[#FFF2F5] text-[#6B4454] hover:bg-[#FFE4EC]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Results Grid or Filtered Empty State */}
          {filteredPlaces.length === 0 ? (
            <div className="rounded-3xl bg-white border border-[#F5D8E2] p-8 text-center">
              <p className="font-display text-lg font-semibold text-[#3E202C]">
                Tidak ada tempat makan yang cocok dengan pencarianmu
              </p>
              <p className="text-sm text-[#8D6676] mt-1">
                Coba ubah kata kunci atau reset filter kategori dan budget.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 min-h-[42px] px-4 py-2 rounded-xl bg-[#FFF2F5] hover:bg-[#FFE4EC] text-[#AA3B63] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onToggleFavorite={onToggleFavorite}
                  onEdit={onOpenEditModal}
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
