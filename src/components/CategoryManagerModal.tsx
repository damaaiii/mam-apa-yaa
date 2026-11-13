import React, { useState } from 'react';
import { Check, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../types/food';

interface CategoryManagerModalProps {
  isOpen: boolean;
  categories: string[];
  onClose: () => void;
  onAddCategory: (name: string) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (name: string) => void;
  onResetCategories: () => void;
}

export function CategoryManagerModal({
  isOpen,
  categories,
  onClose,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onResetCategories,
}: CategoryManagerModalProps) {
  const [newName, setNewName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      setError('Masukkan nama kategori dulu ya.');
      return;
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setError('Kategori tersebut sudah ada.');
      return;
    }
    setError('');
    onAddCategory(trimmed);
    setNewName('');
  };

  const startEdit = (idx: number, current: string) => {
    setEditingIndex(idx);
    setEditValue(current);
    setError('');
  };

  const commitEdit = (oldName: string) => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setError('Nama kategori tidak boleh kosong.');
      return;
    }
    if (
      trimmed.toLowerCase() !== oldName.toLowerCase() &&
      categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())
    ) {
      setError('Nama kategori sudah digunakan.');
      return;
    }
    onRenameCategory(oldName, trimmed);
    setEditingIndex(null);
    setEditValue('');
    setError('');
  };

  const handleReset = () => {
    onResetCategories();
    setEditingIndex(null);
    setError('');
  };

  const isDefaultList =
    categories.length === DEFAULT_CATEGORIES.length &&
    categories.every((c, i) => c === DEFAULT_CATEGORIES[i]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#3E202C]/40 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
    >
      <div className="w-full sm:max-w-md max-h-[88dvh] overflow-y-auto bg-[#FFF9FA] rounded-t-3xl sm:rounded-3xl border border-[#F5D8E2] shadow-2xl animate-pop-in">
        <div className="sticky top-0 z-10 bg-[#FFF9FA]/95 backdrop-blur-md px-6 py-4 border-b border-[#F5D8E2] flex items-center justify-between">
          <div>
            <h2
              id="category-modal-title"
              className="font-display text-xl font-semibold text-[#3E202C]"
            >
              Kelola Kategori
            </h2>
            <p className="text-xs text-[#8D6676] mt-0.5">
              Tambah atau sesuaikan kategori makanan kalian
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup kelola kategori"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#6B4454] hover:bg-[#FFE4EC] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="rounded-xl bg-[#FFE4EC] border border-[#E58BA6] px-3.5 py-2.5 text-xs font-medium text-[#962542]">
              {error}
            </div>
          )}

          {/* Add category form */}
          <form onSubmit={handleAdd} className="flex items-center gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Tambah kategori baru (mis. Cafe, Sushi)"
              className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#F0CCD8] text-sm text-[#3E202C] placeholder:text-[#B58999] focus:outline-none focus:ring-2 focus:ring-[#C8527B]"
            />
            <button
              type="submit"
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C8527B] hover:bg-[#AA3B63] text-white text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </form>

          {/* List of categories */}
          <ul className="divide-y divide-[#FFEAF0] bg-white rounded-2xl border border-[#F5D8E2] overflow-hidden">
            {categories.map((cat, idx) => (
              <li
                key={cat}
                className="px-4 py-2.5 flex items-center justify-between gap-2 min-h-[52px]"
              >
                {editingIndex === idx ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 min-h-[38px] px-3 py-1 rounded-lg bg-[#FFF9FA] border border-[#C8527B] text-sm text-[#3E202C] focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => commitEdit(cat)}
                      aria-label="Simpan nama kategori"
                      className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg bg-[#C8527B] text-white cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      aria-label="Batal edit kategori"
                      className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg bg-[#FFF2F5] text-[#6B4454] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-[#3E202C] truncate">
                      {cat}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(idx, cat)}
                        aria-label={`Ubah kategori ${cat}`}
                        className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg text-[#6B4454] hover:bg-[#FFF2F5] hover:text-[#3E202C] cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {categories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteCategory(cat)}
                          aria-label={`Hapus kategori ${cat}`}
                          className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg text-[#9D4A62] hover:bg-[#FFF0F3] hover:text-[#B83254] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          {!isDefaultList && (
            <button
              type="button"
              onClick={handleReset}
              className="w-full min-h-[42px] px-4 py-2 rounded-xl border border-[#F0CCD8] bg-white hover:bg-[#FFF2F5] text-xs font-semibold text-[#6B4454] inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan Kategori Default</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
