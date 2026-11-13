import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { RibbonBow } from './components/Doodles';
import { FavoritesView } from './components/FavoritesView';
import { FoodListView } from './components/FoodListView';
import { HomeView } from './components/HomeView';
import { Navbar } from './components/Navbar';
import { PlaceFormData, PlaceFormModal } from './components/PlaceFormModal';
import { RouletteView } from './components/RouletteView';
import {
  DatePickRecord,
  DEFAULT_CATEGORIES,
  FoodPlace,
  getBudgetLabel,
  NavTab,
} from './types/food';
import {
  generateId,
  loadCategories,
  loadDeals,
  loadPlaces,
  saveCategories,
  saveDeals,
  savePlaces,
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [places, setPlaces] = useState<FoodPlace[]>(() => loadPlaces());
  const [categories, setCategories] = useState<string[]>(() => loadCategories());
  const [deals, setDeals] = useState<DatePickRecord[]>(() => loadDeals());

  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<FoodPlace | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [rouletteFavoritesOnly, setRouletteFavoritesOnly] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    savePlaces(places);
  }, [places]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveDeals(deals);
  }, [deals]);

  const favoritesCount = useMemo(
    () => places.filter((p) => p.isFavorite).length,
    [places]
  );

  const handleNavigate = useCallback((tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setEditingPlace(null);
    setIsPlaceModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((place: FoodPlace) => {
    setEditingPlace(place);
    setIsPlaceModalOpen(true);
  }, []);

  const handleSavePlace = useCallback(
    (data: PlaceFormData, existingId?: string) => {
      const now = Date.now();
      if (existingId) {
        setPlaces((prev) =>
          prev.map((p) =>
            p.id === existingId
              ? {
                  ...p,
                  ...data,
                  updatedAt: now,
                }
              : p
          )
        );
      } else {
        const newPlace: FoodPlace = {
          id: generateId(),
          ...data,
          createdAt: now,
          updatedAt: now,
          pickedCount: 0,
        };
        setPlaces((prev) => [newPlace, ...prev]);
      }
    },
    []
  );

  const handleDeletePlace = useCallback((id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setPlaces((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite, updatedAt: Date.now() } : p
      )
    );
  }, []);

  const handleAddCategory = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCategories((prev) => {
      if (prev.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return [...prev, trimmed];
    });
  }, []);

  const handleRenameCategory = useCallback((oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setCategories((prev) => prev.map((c) => (c === oldName ? trimmed : c)));
    setPlaces((prev) =>
      prev.map((p) => (p.category === oldName ? { ...p, category: trimmed } : p))
    );
  }, []);

  const handleDeleteCategory = useCallback((name: string) => {
    setCategories((prev) => {
      const remaining = prev.filter((c) => c !== name);
      if (remaining.length === 0) return prev;
      const fallback = remaining.includes('Lainnya') ? 'Lainnya' : remaining[0];
      setPlaces((currentPlaces) =>
        currentPlaces.map((p) =>
          p.category === name ? { ...p, category: fallback } : p
        )
      );
      return remaining;
    });
  }, []);

  const handleResetCategories = useCallback(() => {
    setCategories([...DEFAULT_CATEGORIES]);
  }, []);

  const handleConfirmDeal = useCallback((place: FoodPlace) => {
    setPlaces((prev) =>
      prev.map((p) =>
        p.id === place.id
          ? { ...p, pickedCount: p.pickedCount + 1, updatedAt: Date.now() }
          : p
      )
    );
    const record: DatePickRecord = {
      id: generateId(),
      placeId: place.id,
      placeName: place.name,
      placeEmoji: place.emoji || '🍽️',
      category: place.category,
      budgetLabel: getBudgetLabel(place.budgetTier),
      location: place.location,
      pickedAt: Date.now(),
    };
    setDeals((prev) => [record, ...prev].slice(0, 20));
  }, []);

  const handleSpinFavorites = useCallback(() => {
    setRouletteFavoritesOnly(true);
    handleNavigate('roulette');
  }, [handleNavigate]);

  const consumeFavoritesOnlyFlag = useCallback(() => {
    setRouletteFavoritesOnly(false);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenAddModal={handleOpenAddModal}
        favoritesCount={favoritesCount}
        placesCount={places.length}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'home' && (
              <HomeView
                placesCount={places.length}
                favoritesCount={favoritesCount}
                dealsCount={deals.length}
                categoriesCount={categories.length}
                onNavigate={handleNavigate}
                onOpenAddModal={handleOpenAddModal}
              />
            )}

            {activeTab === 'list' && (
              <FoodListView
                places={places}
                categories={categories}
                onOpenAddModal={handleOpenAddModal}
                onOpenEditModal={handleOpenEditModal}
                onDeletePlace={handleDeletePlace}
                onToggleFavorite={handleToggleFavorite}
                onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
              />
            )}

            {activeTab === 'roulette' && (
              <RouletteView
                places={places}
                categories={categories}
                deals={deals}
                initialFavoritesOnly={rouletteFavoritesOnly}
                onConsumeFavoritesOnlyFlag={consumeFavoritesOnlyFlag}
                onToggleFavorite={handleToggleFavorite}
                onConfirmDeal={handleConfirmDeal}
                onOpenAddModal={handleOpenAddModal}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === 'favorites' && (
              <FavoritesView
                places={places}
                onToggleFavorite={handleToggleFavorite}
                onEditPlace={handleOpenEditModal}
                onDeletePlace={handleDeletePlace}
                onSpinFavorites={handleSpinFavorites}
                onNavigate={handleNavigate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer with closing tagline & safe space for mobile bottom nav */}
      <footer className="border-t border-[#F5D8E2] bg-[#FFF9FA]/80 pt-6 pb-22 md:pb-8 mt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <RibbonBow className="w-5 h-3.5 text-[#C8527B]" />
            <p className="font-display text-sm sm:text-base font-medium text-[#6B4454]">
              Good food, good mood, better dates. ♡
            </p>
          </div>
          <p className="text-xs text-[#8D6676]">
            Data tersimpan otomatis di browser kalian berdua.
          </p>
        </div>
      </footer>

      {/* Add / Edit Food Place Modal */}
      <PlaceFormModal
        isOpen={isPlaceModalOpen}
        editingPlace={editingPlace}
        categories={categories}
        onClose={() => {
          setIsPlaceModalOpen(false);
          setEditingPlace(null);
        }}
        onSave={handleSavePlace}
        onAddCategory={handleAddCategory}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        categories={categories}
        onClose={() => setIsCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
        onRenameCategory={handleRenameCategory}
        onDeleteCategory={handleDeleteCategory}
        onResetCategories={handleResetCategories}
      />
    </div>
  );
}
