import React from 'react';
import { ArrowRight, Disc3, Heart, Plus, Utensils } from 'lucide-react';
import heroIllustration from '../assets/images/hero_date_food_illustration_1794531182640.jpg';
import { NavTab } from '../types/food';
import { HeartDoodle, ResilientImage, RibbonBow, SparkleDoodle } from './Doodles';
import { PWAInstallButton } from './PWAInstallButton';

interface HomeViewProps {
  placesCount: number;
  favoritesCount: number;
  dealsCount: number;
  categoriesCount: number;
  onNavigate: (tab: NavTab) => void;
  onOpenAddModal: () => void;
}

export function HomeView({
  placesCount,
  favoritesCount,
  dealsCount,
  categoriesCount,
  onNavigate,
  onOpenAddModal,
}: HomeViewProps) {
  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Copy & Primary CTA */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5 sm:space-y-6 py-1">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#AA3B63]">
            <RibbonBow className="w-6 h-4 text-[#C8527B]" />
            <span>Personal Date Night Food Picker</span>
            <SparkleDoodle className="w-3.5 h-3.5 text-[#E58BA6]" />
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            <h1 className="font-display text-3xl min-[375px]:text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold text-[#3E202C] leading-[1.12] tracking-tight text-balance">
              What to Eat with Mas?
            </h1>
            <p className="text-base sm:text-lg text-[#6B4454] leading-relaxed max-w-xl">
              No more &lsquo;terserah, kamu aja&rsquo; moments ♡
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#8D6676] leading-relaxed max-w-lg">
            Kumpulkan semua tempat makan favorit kalian berdua, atur kategori dan budget sesuai mood hari ini, lalu biarkan roda keberuntungan memilihkan tempat date kalian berikutnya.
          </p>

          {/* Primary & Secondary Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('roulette')}
              className="min-h-[50px] px-6 sm:px-7 py-3.5 rounded-2xl bg-[#C8527B] hover:bg-[#AA3B63] active:scale-[0.98] text-white font-semibold text-base shadow-md shadow-[#C8527B]/20 inline-flex items-center justify-center gap-2.5 transition-all duration-150 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C8527B]"
            >
              <Disc3 className="w-5 h-5" />
              <span>Let&apos;s Pick Our Food!</span>
            </button>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="min-h-[50px] px-5 py-3.5 rounded-2xl bg-white hover:bg-[#FFF2F5] border border-[#F0CCD8] text-[#3E202C] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8527B]"
            >
              <Plus className="w-4 h-4 text-[#C8527B]" />
              <span>Tambah Tempat Makan</span>
            </button>

            <PWAInstallButton />
          </div>
        </div>

        {/* Right Column: Cute Food Date Illustration */}
        <div className="lg:col-span-6 flex items-stretch">
          <div className="relative w-full rounded-3xl bg-white border border-[#F5D8E2] p-3 sm:p-4 shadow-[0_12px_36px_rgba(200,82,123,0.08)] flex flex-col">
            <div className="relative overflow-hidden rounded-2xl bg-[#FFF2F5] aspect-[4/3] lg:aspect-auto lg:h-full min-h-[260px]">
              <ResilientImage
                src={heroIllustration}
                alt="Ilustrasi makanan date romantis berisi ramen, dimsum, milk tea, dan kue stroberi dengan pita pink"
                className="w-full h-full object-cover"
                fallbackTitle="What to Eat with Mas?"
              />
            </div>

            {/* Subtle corner doodle accent */}
            <div
              aria-hidden="true"
              className="hidden sm:flex absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-[#FFE4EC] border border-[#F5D8E2] items-center justify-center shadow-sm rotate-6"
            >
              <HeartDoodle className="w-5 h-5 text-[#C8527B]" />
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics & Quick Navigation Strip */}
      <section aria-label="Ringkasan tempat makan">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Stat 1: Total Food Places + Navigation to List */}
          <button
            type="button"
            onClick={() => onNavigate('list')}
            className="text-left bg-white hover:bg-[#FFFDFD] rounded-2xl border border-[#F5D8E2] p-5 shadow-[0_2px_12px_rgba(200,82,123,0.04)] hover:shadow-[0_8px_24px_rgba(200,82,123,0.09)] transition-all duration-150 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8527B]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8D6676]">
                Tempat Makan Tersimpan
              </span>
              <Utensils className="w-4 h-4 text-[#C8527B]" />
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <p className="font-display text-3xl font-semibold text-[#3E202C] tabular-nums">
                {placesCount}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#AA3B63] group-hover:translate-x-0.5 transition-transform">
                <span>Lihat Daftar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="mt-1.5 text-xs text-[#8D6676] tabular-nums">
              {placesCount === 0
                ? 'Yuk mulai isi daftar tempat makan kalian'
                : `Tersebar di ${categoriesCount} kategori pilihan`}
            </p>
          </button>

          {/* Stat 2: Saved Favorites + Navigation to Favorites */}
          <button
            type="button"
            onClick={() => onNavigate('favorites')}
            className="text-left bg-white hover:bg-[#FFFDFD] rounded-2xl border border-[#F5D8E2] p-5 shadow-[0_2px_12px_rgba(200,82,123,0.04)] hover:shadow-[0_8px_24px_rgba(200,82,123,0.09)] transition-all duration-150 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8527B]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8D6676]">
                Tempat Favorit Berdua
              </span>
              <Heart className="w-4 h-4 text-[#C8527B] fill-[#FFE4EC]" />
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <p className="font-display text-3xl font-semibold text-[#3E202C] tabular-nums">
                {favoritesCount}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#AA3B63] group-hover:translate-x-0.5 transition-transform">
                <span>Buka Favorit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="mt-1.5 text-xs text-[#8D6676]">
              {favoritesCount === 0
                ? 'Tandai tempat paling andalan pakai ikon hati'
                : 'Spot andalan kalau lagi pengen yang pasti enak'}
            </p>
          </button>

          {/* Stat 3: Deals Confirmed + Navigation to Roulette */}
          <button
            type="button"
            onClick={() => onNavigate('roulette')}
            className="text-left bg-white hover:bg-[#FFFDFD] rounded-2xl border border-[#F5D8E2] p-5 shadow-[0_2px_12px_rgba(200,82,123,0.04)] hover:shadow-[0_8px_24px_rgba(200,82,123,0.09)] transition-all duration-150 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8527B]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8D6676]">
                Date Terpilih via Roulette
              </span>
              <Disc3 className="w-4 h-4 text-[#C8527B]" />
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <p className="font-display text-3xl font-semibold text-[#3E202C] tabular-nums">
                {dealsCount}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#AA3B63] group-hover:translate-x-0.5 transition-transform">
                <span>Putar Roda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="mt-1.5 text-xs text-[#8D6676]">
              {dealsCount === 0
                ? 'Siap menghilangkan drama bingung mau makan apa'
                : 'Momen makan bareng yang sudah berhasil diputuskan'}
            </p>
          </button>
        </div>
      </section>

      {/* Simple 3-Step Editorial How-To */}
      <section className="rounded-3xl bg-[#FFF2F5]/80 border border-[#F5D8E2] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#3E202C]">
              Cara Pakai untuk Date Kalian
            </h2>
            <p className="text-sm text-[#6B4454] mt-0.5">
              Praktis dalam tiga langkah singkat sebelum berangkat.
            </p>
          </div>
          <SparkleDoodle className="w-5 h-5 text-[#D8688C] hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#AA3B63] tabular-nums">
              01. Catat Spot Favorit
            </span>
            <h3 className="font-display text-base font-semibold text-[#3E202C]">
              Masukkan daftar kalian sendiri
            </h3>
            <p className="text-sm text-[#6B4454] leading-relaxed">
              Tambahkan warung langganan, kafe lucu, sampai tempat yang baru ingin dicoba beserta estimasi harga dan catatannya.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#AA3B63] tabular-nums">
              02. Filter Mood &amp; Budget
            </span>
            <h3 className="font-display text-base font-semibold text-[#3E202C]">
              Sesuaikan keinginan hari ini
            </h3>
            <p className="text-sm text-[#6B4454] leading-relaxed">
              Lagi pengen mie murah meriah atau Japanese food spesial? Pilih filter kategori dan kisaran budget di Food Roulette.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#AA3B63] tabular-nums">
              03. Spin &amp; Langsung Berangkat
            </span>
            <h3 className="font-display text-base font-semibold text-[#3E202C]">
              Biarkan roda yang memutuskan
            </h3>
            <p className="text-sm text-[#6B4454] leading-relaxed">
              Klik Spin the Wheel, lihat tempat makan terpilih secara acak, lalu tekan Deal kalau kalian berdua sepakat!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
