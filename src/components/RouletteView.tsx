import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Disc3,
  Heart,
  MapPin,
  Plus,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
  StickyNote,
  Volume2,
  VolumeX,
} from 'lucide-react';
import emptyPlateIllustration from '../assets/images/cute_empty_plate_1794531181364.jpg';
import {
  BUDGET_TIERS,
  BudgetTier,
  DatePickRecord,
  FoodPlace,
  getBudgetLabel,
  NavTab,
} from '../types/food';
import { playTickSound, playWinChime } from '../utils/sound';
import { getTrueRandomIndex } from '../utils/storage';
import { HeartDoodle, ResilientImage, RibbonBow, SparkleDoodle } from './Doodles';
import { RouletteWheel } from './RouletteWheel';

interface RouletteViewProps {
  places: FoodPlace[];
  categories: string[];
  deals: DatePickRecord[];
  initialFavoritesOnly?: boolean;
  onConsumeFavoritesOnlyFlag?: () => void;
  onToggleFavorite: (id: string) => void;
  onConfirmDeal: (place: FoodPlace) => void;
  onOpenAddModal: () => void;
  onNavigate: (tab: NavTab) => void;
}

const MAX_WHEEL_SLICES = 12;

export function RouletteView({
  places,
  categories,
  deals,
  initialFavoritesOnly = false,
  onConsumeFavoritesOnlyFlag,
  onToggleFavorite,
  onConfirmDeal,
  onOpenAddModal,
  onNavigate,
}: RouletteViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier | 'ALL'>('ALL');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(initialFavoritesOnly);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [filtersOpenMobile, setFiltersOpenMobile] = useState<boolean>(true);

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wheelItems, setWheelItems] = useState<FoodPlace[]>([]);
  const [winner, setWinner] = useState<FoodPlace | null>(null);
  const [dealConfirmed, setDealConfirmed] = useState(false);

  const spinTimeoutRef = useRef<number | null>(null);
  const tickIntervalRef = useRef<number | null>(null);
  const lastWinnerIdRef = useRef<string | null>(null);
  const resultSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (initialFavoritesOnly) {
      setFavoritesOnly(true);
      onConsumeFavoritesOnlyFlag?.();
    }
  }, [initialFavoritesOnly, onConsumeFavoritesOnlyFlag]);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) window.clearTimeout(spinTimeoutRef.current);
      if (tickIntervalRef.current) window.clearInterval(tickIntervalRef.current);
    };
  }, []);

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      if (favoritesOnly && !p.isFavorite) return false;
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (selectedBudget !== 'ALL' && p.budgetTier !== selectedBudget) return false;
      return true;
    });
  }, [places, favoritesOnly, selectedCategory, selectedBudget]);

  useEffect(() => {
    if (!isSpinning) {
      setWheelItems(filteredPlaces.slice(0, MAX_WHEEL_SLICES));
    }
  }, [filteredPlaces, isSpinning]);

  const activeWinner = useMemo(() => {
    if (!winner) return null;
    return places.find((p) => p.id === winner.id) ?? winner;
  }, [winner, places]);

  const startSpin = (avoidLastWinner = false) => {
    if (isSpinning || filteredPlaces.length === 0) return;

    let candidatePool = filteredPlaces;
    if (
      avoidLastWinner &&
      lastWinnerIdRef.current &&
      filteredPlaces.length > 1
    ) {
      candidatePool = filteredPlaces.filter((p) => p.id !== lastWinnerIdRef.current);
    }

    const picked = candidatePool[getTrueRandomIndex(candidatePool.length)];
    lastWinnerIdRef.current = picked.id;

    let slices: FoodPlace[];
    if (filteredPlaces.length <= MAX_WHEEL_SLICES) {
      slices = [...filteredPlaces];
    } else {
      const others = filteredPlaces.filter((p) => p.id !== picked.id);
      const sampled: FoodPlace[] = [picked];
      while (sampled.length < MAX_WHEEL_SLICES && others.length > 0) {
        const idx = getTrueRandomIndex(others.length);
        sampled.push(others[idx]);
        others.splice(idx, 1);
      }
      const swapIdx = getTrueRandomIndex(sampled.length);
      [sampled[0], sampled[swapIdx]] = [sampled[swapIdx], sampled[0]];
      slices = sampled;
    }

    const winnerIndex = slices.findIndex((s) => s.id === picked.id);
    const sliceAngle = 360 / slices.length;

    const maxJitter = slices.length > 1 ? sliceAngle * 0.28 : 25;
    const jitter = (Math.random() * 2 - 1) * maxJitter;
    const targetMod =
      ((360 - ((winnerIndex * sliceAngle + jitter) % 360)) + 360) % 360;

    const currentMod = ((rotation % 360) + 360) % 360;
    const deltaToTarget = (targetMod - currentMod + 360) % 360;
    const extraSpins = (5 + getTrueRandomIndex(3)) * 360;
    const nextRotation = rotation + extraSpins + deltaToTarget;

    setWheelItems(slices);
    setWinner(null);
    setDealConfirmed(false);
    setIsSpinning(true);

    requestAnimationFrame(() => {
      setRotation(nextRotation);
    });

    if (tickIntervalRef.current) window.clearInterval(tickIntervalRef.current);
    let tickCount = 0;
    tickIntervalRef.current = window.setInterval(() => {
      tickCount += 1;
      if (tickCount <= 22) {
        playTickSound(soundEnabled, tickCount % 4);
      }
    }, 155);

    if (spinTimeoutRef.current) window.clearTimeout(spinTimeoutRef.current);
    spinTimeoutRef.current = window.setTimeout(() => {
      if (tickIntervalRef.current) {
        window.clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      setIsSpinning(false);
      setWinner(picked);
      playWinChime(soundEnabled);

      // Smoothly bring winner card into view on mobile
      window.setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 100);
    }, 4250);
  };

  const handleDeal = () => {
    if (!activeWinner || dealConfirmed) return;
    onConfirmDeal(activeWinner);
    setDealConfirmed(true);
    playWinChime(soundEnabled);
  };

  const resetFilters = () => {
    setSelectedCategory('ALL');
    setSelectedBudget('ALL');
    setFavoritesOnly(false);
  };

  if (places.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#AA3B63] mb-1">
            <RibbonBow className="w-5 h-3.5 text-[#C8527B]" />
            <span>Random Food Picker</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-semibold text-[#3E202C]">
            Food Roulette
          </h1>
        </div>

        <section className="rounded-3xl bg-white border border-[#F5D8E2] p-6 sm:p-12 text-center shadow-[0_6px_28px_rgba(200,82,123,0.05)]">
          <div className="max-w-sm mx-auto flex flex-col items-center">
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border border-[#FFE4EC] bg-[#FFF9FA] mb-5">
              <ResilientImage
                src={emptyPlateIllustration}
                alt="Ilustrasi piring keramik pastel kosong"
                className="w-full h-full object-cover"
                fallbackTitle="Your food list is still empty!"
              />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#3E202C]">
              Your food list is still empty!
            </h2>
            <p className="text-sm sm:text-base text-[#6B4454] mt-2">
              Yuk, tambahkan tempat makan favorit kalian ♡
            </p>
            <div className="mt-6 flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={onOpenAddModal}
                className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#C8527B] hover:bg-[#AA3B63] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 shadow-sm shadow-[#C8527B]/25 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Tempat Makan</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('list')}
                className="min-h-[48px] px-5 py-3 rounded-2xl bg-[#FFF2F5] hover:bg-[#FFE4EC] text-[#AA3B63] font-semibold text-sm cursor-pointer"
              >
                Buka My Places
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#AA3B63] mb-1">
            <RibbonBow className="w-5 h-3.5 text-[#C8527B]" />
            <span>Random Food Picker</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-semibold text-[#3E202C]">
            Food Roulette
          </h1>
          <p className="text-sm text-[#6B4454] mt-1">
            Pilih filter kategori &amp; budget, lalu putar rodanya untuk memilih tempat date kalian!
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSoundEnabled((prev) => !prev)}
          aria-label={soundEnabled ? 'Matikan efek suara roda' : 'Nyalakan efek suara roda'}
          className="self-start sm:self-auto min-h-[44px] px-3.5 py-2 rounded-xl bg-white hover:bg-[#FFF2F5] border border-[#F0CCD8] text-xs font-semibold text-[#6B4454] inline-flex items-center gap-2 cursor-pointer"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-[#C8527B]" />
              <span>Efek Suara Roda</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-[#8D6676]" />
              <span>Suara Roda Mati</span>
            </>
          )}
        </button>
      </div>

      {/* Main Layout: Mobile-first vertical stack (Filter -> Wheel -> Result) / Desktop 2-col */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        {/* Filter Panel (Top on mobile, Top-Left on desktop) */}
        <section className="lg:col-span-5 lg:col-start-1 lg:row-start-1 rounded-3xl bg-white border border-[#F5D8E2] p-4 sm:p-6 shadow-[0_4px_20px_rgba(200,82,123,0.04)]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C8527B]" />
              <h2 className="font-display text-base sm:text-lg font-semibold text-[#3E202C]">
                Filter Pilihan
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#AA3B63] tabular-nums">
                {filteredPlaces.length} tempat cocok
              </span>
              <button
                type="button"
                onClick={() => setFiltersOpenMobile((prev) => !prev)}
                aria-expanded={filtersOpenMobile}
                aria-label={filtersOpenMobile ? 'Sembunyikan filter' : 'Tampilkan filter'}
                className="lg:hidden min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl bg-[#FFF2F5] text-[#AA3B63] cursor-pointer"
              >
                {filtersOpenMobile ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div
            className={`${
              filtersOpenMobile ? 'block' : 'hidden lg:block'
            } space-y-4 mt-4`}
          >
            {/* Category filter */}
            <div>
              <span className="block text-xs font-semibold text-[#6B4454] mb-2">
                Kategori Makanan
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  disabled={isSpinning}
                  onClick={() => setSelectedCategory('ALL')}
                  className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
                    selectedCategory === 'ALL'
                      ? 'bg-[#C8527B] text-white'
                      : 'bg-[#FFF2F5] text-[#6B4454] hover:bg-[#FFE4EC]'
                  }`}
                >
                  Semua kategori
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    disabled={isSpinning}
                    onClick={() => setSelectedCategory(cat)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
                      selectedCategory === cat
                        ? 'bg-[#C8527B] text-white'
                        : 'bg-[#FFF2F5] text-[#6B4454] hover:bg-[#FFE4EC]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget filter */}
            <div>
              <span className="block text-xs font-semibold text-[#6B4454] mb-2">
                Kisaran Budget per Orang
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  disabled={isSpinning}
                  onClick={() => setSelectedBudget('ALL')}
                  className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
                    selectedBudget === 'ALL'
                      ? 'bg-[#C8527B] text-white'
                      : 'bg-[#FFF2F5] text-[#6B4454] hover:bg-[#FFE4EC]'
                  }`}
                >
                  Semua budget
                </button>
                {BUDGET_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    disabled={isSpinning}
                    onClick={() => setSelectedBudget(tier.id)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
                      selectedBudget === tier.id
                        ? 'bg-[#C8527B] text-white'
                        : 'bg-[#FFF2F5] text-[#6B4454] hover:bg-[#FFE4EC]'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Favorites Only Toggle */}
            <button
              type="button"
              disabled={isSpinning}
              onClick={() => setFavoritesOnly((prev) => !prev)}
              className={`w-full min-h-[44px] px-4 py-2 rounded-xl border flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
                favoritesOnly
                  ? 'bg-[#FFE4EC] border-[#E58BA6] text-[#AA3B63]'
                  : 'bg-[#FFF9FA] border-[#F0CCD8] text-[#6B4454] hover:bg-[#FFF2F5]'
              }`}
            >
              <span>Hanya putar dari daftar Favorit</span>
              <Heart
                className={`w-4 h-4 ${
                  favoritesOnly ? 'fill-[#C8527B] text-[#C8527B]' : 'text-[#B58999]'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Roulette Wheel Panel (Middle on mobile, Right column on desktop) */}
        <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:row-span-2 flex flex-col items-center justify-center rounded-3xl bg-white border border-[#F5D8E2] p-4 sm:p-8 shadow-[0_8px_32px_rgba(200,82,123,0.06)]">
          {filteredPlaces.length === 0 ? (
            <div className="py-10 text-center max-w-sm space-y-3">
              <p className="font-display text-lg sm:text-xl font-semibold text-[#3E202C]">
                Belum ada tempat makan yang cocok dengan filter ini
              </p>
              <p className="text-sm text-[#6B4454]">
                Coba ganti pilihan kategori/budget atau tambahkan tempat makan baru ke daftar kalian.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FFF2F5] hover:bg-[#FFE4EC] text-[#AA3B63] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filter</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenAddModal}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C8527B] hover:bg-[#AA3B63] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Tempat</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center space-y-6">
              <RouletteWheel
                items={
                  wheelItems.length > 0
                    ? wheelItems
                    : filteredPlaces.slice(0, MAX_WHEEL_SLICES)
                }
                rotation={rotation}
                isSpinning={isSpinning}
              />

              {/* Full-name candidate overview so no place name is ever hidden */}
              <div className="w-full text-center text-xs text-[#8D6676] leading-relaxed px-1">
                <span className="font-semibold text-[#6B4454]">Kandidat ({filteredPlaces.length}): </span>
                {filteredPlaces.map((p, idx) => (
                  <span key={p.id}>
                    {p.emoji} {p.name}
                    {idx < filteredPlaces.length - 1 && (
                      <span aria-hidden="true" className="mx-1.5 text-[#D8A5B7]">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => startSpin(false)}
                disabled={isSpinning}
                className="w-full sm:w-auto min-w-[240px] min-h-[52px] px-8 py-3.5 rounded-2xl bg-[#C8527B] hover:bg-[#AA3B63] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed text-white font-semibold text-base tracking-wide shadow-md shadow-[#C8527B]/25 inline-flex items-center justify-center gap-2.5 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C8527B]"
              >
                <Disc3 className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? 'Sedang Memutar...' : 'SPIN THE WHEEL!'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Winning Result Card (Directly below Wheel on mobile, Below Filters on desktop) */}
        {activeWinner && (
          <section
            ref={resultSectionRef}
            aria-live="polite"
            className="lg:col-span-5 lg:col-start-1 lg:row-start-2 rounded-3xl bg-gradient-to-b from-white to-[#FFF7F9] border-2 border-[#E58BA6] p-5 sm:p-6 shadow-[0_12px_36px_rgba(200,82,123,0.14)] animate-pop-in space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#AA3B63]">
                <SparkleDoodle className="w-4 h-4 text-[#C8527B]" />
                <span>Pilihan Takdir Hari Ini</span>
              </div>
              <button
                type="button"
                onClick={() => onToggleFavorite(activeWinner.id)}
                aria-label={
                  activeWinner.isFavorite
                    ? 'Hapus dari favorit'
                    : 'Simpan ke favorit'
                }
                className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-xl hover:bg-[#FFF2F5] cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 ${
                    activeWinner.isFavorite
                      ? 'fill-[#C8527B] text-[#C8527B]'
                      : 'text-[#B58999]'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF2F5] border border-[#FFE4EC] flex items-center justify-center text-3xl shrink-0">
                {activeWinner.emoji || '🍽️'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-2xl font-semibold text-[#3E202C] leading-tight break-words">
                  {activeWinner.name}
                </h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6B4454] mt-1">
                  <span className="font-semibold text-[#AA3B63]">
                    {activeWinner.category}
                  </span>
                  <span aria-hidden="true" className="text-[#D8A5B7]">
                    ·
                  </span>
                  <span className="tabular-nums">
                    {activeWinner.estimatedPriceDetail?.trim()
                      ? `${getBudgetLabel(activeWinner.budgetTier)} (${activeWinner.estimatedPriceDetail.trim()})`
                      : getBudgetLabel(activeWinner.budgetTier)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-[#6B4454] pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C8527B] shrink-0 mt-0.5" />
                <span className="leading-snug break-words">
                  {activeWinner.location}
                </span>
              </div>
              {activeWinner.notes && activeWinner.notes.trim().length > 0 && (
                <div className="flex items-start gap-2 text-xs text-[#8D6676] bg-white rounded-xl px-3 py-2.5 border border-[#FFEAF0]">
                  <StickyNote className="w-3.5 h-3.5 text-[#D8688C] shrink-0 mt-0.5" />
                  <p className="leading-relaxed break-words">
                    {activeWinner.notes}
                  </p>
                </div>
              )}
            </div>

            {dealConfirmed && (
              <div className="rounded-2xl bg-[#FFE4EC]/70 border border-[#E58BA6] px-4 py-3 flex items-center gap-2.5 text-sm font-semibold text-[#AA3B63]">
                <HeartDoodle className="w-4 h-4 text-[#C8527B] shrink-0" />
                <span>Yay! Date spot locked in — selamat makan bareng Mas ♡</span>
              </div>
            )}

            <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleDeal}
                disabled={dealConfirmed}
                className={`flex-1 min-h-[48px] px-4 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  dealConfirmed
                    ? 'bg-[#FFE4EC] text-[#AA3B63] cursor-default'
                    : 'bg-[#C8527B] hover:bg-[#AA3B63] text-white shadow-sm shadow-[#C8527B]/20'
                }`}
              >
                <Check className="w-4 h-4 shrink-0" />
                <span>{dealConfirmed ? 'Sudah Deal!' : "Deal! We're going there!"}</span>
              </button>
              <button
                type="button"
                onClick={() => startSpin(true)}
                className="min-h-[48px] px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFF2F5] border border-[#F0CCD8] text-[#3E202C] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#C8527B]" />
                <span>Spin Again!</span>
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Recent Date Deals History */}
      {deals.length > 0 && (
        <section className="rounded-3xl bg-white border border-[#F5D8E2] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-[#3E202C]">
              Riwayat Date Terpilih
            </h2>
            <span className="text-xs text-[#8D6676] tabular-nums">
              {deals.length} date tersimpan
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deals.slice(0, 6).map((deal) => (
              <div
                key={deal.id}
                className="rounded-2xl bg-[#FFF9FA] border border-[#FFE4EC] px-4 py-3 flex items-start gap-3"
              >
                <span className="text-2xl shrink-0" aria-hidden="true">
                  {deal.placeEmoji}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#3E202C] break-words">
                    {deal.placeName}
                  </p>
                  <p className="text-xs text-[#8D6676] mt-0.5 break-words">
                    {deal.category} · {deal.budgetLabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
