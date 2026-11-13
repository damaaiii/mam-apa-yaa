import React, { useEffect, useState } from 'react';
import { Heart, Plus, X } from 'lucide-react';
import { BUDGET_TIERS, BudgetTier, FOOD_EMOJIS, FoodPlace } from '../types/food';

export interface PlaceFormData {
  name: string;
  category: string;
  budgetTier: BudgetTier;
  estimatedPriceDetail: string;
  location: string;
  notes: string;
  emoji: string;
  isFavorite: boolean;
}

interface PlaceFormModalProps {
  isOpen: boolean;
  editingPlace: FoodPlace | null;
  categories: string[];
  onClose: () => void;
  onSave: (data: PlaceFormData, existingId?: string) => void;
  onAddCategory: (categoryName: string) => void;
}

export function PlaceFormModal({
  isOpen,
  editingPlace,
  categories,
  onClose,
  onSave,
  onAddCategory,
}: PlaceFormModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Mie');
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('25k-50k');
  const [estimatedPriceDetail, setEstimatedPriceDetail] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [emoji, setEmoji] = useState('🍜');
  const [isFavorite, setIsFavorite] = useState(false);

  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg('');
    setShowNewCategoryInput(false);
    setNewCategoryInput('');

    if (editingPlace) {
      setName(editingPlace.name);
      setCategory(editingPlace.category);
      setBudgetTier(editingPlace.budgetTier);
      setEstimatedPriceDetail(editingPlace.estimatedPriceDetail || '');
      setLocation(editingPlace.location);
      setNotes(editingPlace.notes || '');
      setEmoji(editingPlace.emoji || '🍜');
      setIsFavorite(editingPlace.isFavorite);
    } else {
      setName('');
      setCategory(categories[0] || 'Mie');
      setBudgetTier('25k-50k');
      setEstimatedPriceDetail('');
      setLocation('');
      setNotes('');
      setEmoji('🍜');
      setIsFavorite(false);
    }
  }, [isOpen, editingPlace, categories]);

  if (!isOpen) return null;

  const handleCreateInlineCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    setCategory(trimmed);
    setNewCategoryInput('');
    setShowNewCategoryInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama tempat makannya diisi dulu ya ♡');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Lokasi atau alamatnya diisi biar nggak nyasar ♡');
      return;
    }
    onSave(
      {
        name: name.trim(),
        category: category.trim() || 'Lainnya',
        budgetTier,
        estimatedPriceDetail: estimatedPriceDetail.trim(),
        location: location.trim(),
        notes: notes.trim(),
        emoji: emoji.trim() || '🍽️',
        isFavorite,
      },
      editingPlace?.id
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#3E202C]/40 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="place-form-title"
    >
      <div className="w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto bg-[#FFF9FA] rounded-t-3xl sm:rounded-3xl border border-[#F5D8E2] shadow-2xl animate-pop-in">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#FFF9FA]/95 backdrop-blur-md px-6 py-4 border-b border-[#F5D8E2] flex items-center justify-between">
          <div>
            <h2
              id="place-form-title"
              className="font-display text-xl font-semibold text-[#3E202C]"
            >
              {editingPlace ? 'Edit Tempat Makan' : 'Tambah Tempat Makan'}
            </h2>
            <p className="text-xs text-[#8D6676] mt-0.5">
              Simpan spot makan buat date bareng Mas ♡
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup form"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#6B4454] hover:bg-[#FFE4EC] hover:text-[#3E202C] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div
              role="alert"
              className="rounded-xl bg-[#FFE4EC] border border-[#E58BA6] px-4 py-3 text-sm font-medium text-[#962542]"
            >
              {errorMsg}
            </div>
          )}

          {/* Emoji / Icon Picker */}
          <div>
            <label className="block text-sm font-semibold text-[#3E202C] mb-2">
              Ikon / Emoji Makanan
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FOOD_EMOJIS.map((item) => {
                const selected = emoji === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setEmoji(item)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#C8527B] ring-2 ring-[#C8527B] ring-offset-2 ring-offset-[#FFF9FA] scale-105'
                        : 'bg-white border border-[#F5D8E2] hover:bg-[#FFF2F5]'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={4}
                aria-label="Custom emoji"
                placeholder="🍽️"
                className="w-12 h-10 text-center text-lg rounded-xl bg-white border border-[#F5D8E2] focus:outline-none focus:ring-2 focus:ring-[#C8527B]"
              />
            </div>
          </div>

          {/* Nama tempat makan */}
          <div>
            <label
              htmlFor="place-name"
              className="block text-sm font-semibold text-[#3E202C] mb-1.5"
            >
              Nama Tempat Makan <span className="text-[#C8527B]">*</span>
            </label>
            <input
              id="place-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Mie Gacoan / Ramen Ya / Bakso President"
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white border border-[#F0CCD8] text-[#3E202C] placeholder:text-[#B58999] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8527B] focus:border-transparent"
            />
          </div>

          {/* Kategori makanan */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="place-category"
                className="block text-sm font-semibold text-[#3E202C]"
              >
                Kategori Makanan
              </label>
              <button
                type="button"
                onClick={() => setShowNewCategoryInput((prev) => !prev)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#AA3B63] hover:text-[#C8527B] cursor-pointer py-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah kategori baru</span>
              </button>
            </div>

            {showNewCategoryInput && (
              <div className="flex items-center gap-2 mb-2.5">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  placeholder="Nama kategori baru (mis. Cafe / Padang)"
                  className="flex-1 min-h-[40px] px-3 py-1.5 rounded-xl bg-white border border-[#E58BA6] text-sm text-[#3E202C] focus:outline-none focus:ring-2 focus:ring-[#C8527B]"
                />
                <button
                  type="button"
                  onClick={handleCreateInlineCategory}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#C8527B] text-white text-xs font-semibold hover:bg-[#AA3B63] cursor-pointer whitespace-nowrap"
                >
                  Simpan
                </button>
              </div>
            )}

            <select
              id="place-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white border border-[#F0CCD8] text-[#3E202C] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8527B]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Estimasi harga per orang */}
          <div>
            <span className="block text-sm font-semibold text-[#3E202C] mb-2">
              Estimasi Harga per Orang
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUDGET_TIERS.map((tier) => {
                const active = budgetTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setBudgetTier(tier.id)}
                    className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#C8527B] text-white shadow-sm shadow-[#C8527B]/20'
                        : 'bg-white border border-[#F0CCD8] text-[#6B4454] hover:bg-[#FFF2F5]'
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={estimatedPriceDetail}
              onChange={(e) => setEstimatedPriceDetail(e.target.value)}
              placeholder="Detail harga opsional (mis. Rp 35.000/orang)"
              className="mt-2.5 w-full min-h-[42px] px-4 py-2 rounded-xl bg-white border border-[#F0CCD8] text-[#3E202C] placeholder:text-[#B58999] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8527B]"
            />
          </div>

          {/* Lokasi atau alamat */}
          <div>
            <label
              htmlFor="place-location"
              className="block text-sm font-semibold text-[#3E202C] mb-1.5"
            >
              Lokasi atau Alamat <span className="text-[#C8527B]">*</span>
            </label>
            <input
              id="place-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Jl. Soekarno Hatta No. 12 / Dekat Alun-Alun"
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white border border-[#F0CCD8] text-[#3E202C] placeholder:text-[#B58999] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8527B]"
            />
          </div>

          {/* Catatan tambahan */}
          <div>
            <label
              htmlFor="place-notes"
              className="block text-sm font-semibold text-[#3E202C] mb-1.5"
            >
              Catatan Tambahan <span className="font-normal text-[#8D6676]">(opsional)</span>
            </label>
            <textarea
              id="place-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Pesen kuah mala level 1, tempatnya adem buat ngobrol"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#F0CCD8] text-[#3E202C] placeholder:text-[#B58999] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8527B] resize-none"
            />
          </div>

          {/* Favorite toggle */}
          <button
            type="button"
            onClick={() => setIsFavorite((prev) => !prev)}
            className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl border flex items-center justify-between text-sm font-medium transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-[#FFE4EC] border-[#E58BA6] text-[#AA3B63]'
                : 'bg-white border-[#F0CCD8] text-[#6B4454] hover:bg-[#FFF2F5]'
            }`}
          >
            <span>Tandai sebagai tempat favorit</span>
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-[#C8527B] text-[#C8527B]' : 'text-[#B58999]'
              }`}
            />
          </button>

          {/* Submit & Cancel */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl border border-[#F0CCD8] bg-white hover:bg-[#FFF2F5] text-sm font-semibold text-[#6B4454] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-[2] min-h-[46px] px-5 py-2.5 rounded-xl bg-[#C8527B] hover:bg-[#AA3B63] text-white text-sm font-semibold shadow-sm shadow-[#C8527B]/25 transition-colors cursor-pointer"
            >
              {editingPlace ? 'Simpan Perubahan' : 'Simpan Tempat Makan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
