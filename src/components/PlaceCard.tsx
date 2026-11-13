import React, { useState } from 'react';
import { Heart, MapPin, Pencil, StickyNote, Trash2 } from 'lucide-react';
import { FoodPlace, getBudgetLabel } from '../types/food';

interface PlaceCardProps {
  place: FoodPlace;
  onToggleFavorite: (id: string) => void;
  onEdit: (place: FoodPlace) => void;
  onDelete: (id: string) => void;
}

export function PlaceCard({
  place,
  onToggleFavorite,
  onEdit,
  onDelete,
}: PlaceCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const budgetDisplay = place.estimatedPriceDetail?.trim()
    ? `${getBudgetLabel(place.budgetTier)} (${place.estimatedPriceDetail.trim()})`
    : getBudgetLabel(place.budgetTier);

  return (
    <article className="group bg-white rounded-2xl border border-[#F5D8E2] p-5 shadow-[0_2px_12px_rgba(200,82,123,0.04)] hover:shadow-[0_8px_24px_rgba(200,82,123,0.09)] transition-all duration-200 flex flex-col justify-between gap-4">
      <div>
        {/* Card Header: Emoji + Name + Heart */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-2xl bg-[#FFF2F5] border border-[#FFE4EC] flex items-center justify-center text-2xl shrink-0 select-none"
              aria-hidden="true"
            >
              {place.emoji || '🍽️'}
            </div>
            <div className="min-w-0 pt-0.5">
              <h3 className="font-display text-lg font-semibold text-[#3E202C] leading-snug break-words">
                {place.name}
              </h3>
              {/* Clean Zero-Pill Metadata */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6B4454] mt-1">
                <span className="font-medium text-[#AA3B63]">{place.category}</span>
                <span aria-hidden="true" className="text-[#D8A5B7]">·</span>
                <span className="tabular-nums">{budgetDisplay}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleFavorite(place.id)}
            aria-label={
              place.isFavorite
                ? `Hapus ${place.name} dari favorit`
                : `Simpan ${place.name} ke favorit`
            }
            aria-pressed={place.isFavorite}
            className="min-w-[44px] min-h-[44px] -mr-2 -mt-1 flex items-center justify-center rounded-xl hover:bg-[#FFF2F5] active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8527B]"
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-150 ${
                place.isFavorite
                  ? 'fill-[#C8527B] text-[#C8527B]'
                  : 'text-[#B58999] hover:text-[#C8527B]'
              }`}
            />
          </button>
        </div>

        {/* Location & Notes */}
        <div className="mt-4 space-y-2 text-sm text-[#6B4454]">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#C8527B] shrink-0 mt-0.5" />
            <span className="leading-snug break-words">{place.location}</span>
          </div>
          {place.notes && place.notes.trim().length > 0 && (
            <div className="flex items-start gap-2 text-xs text-[#8D6676] bg-[#FFF9FA] rounded-xl px-3 py-2 border border-[#FFEAF0]">
              <StickyNote className="w-3.5 h-3.5 text-[#D8688C] shrink-0 mt-0.5" />
              <p className="leading-relaxed break-words">{place.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-[#FFF0F4] flex items-center justify-between gap-2">
        <span className="text-xs text-[#8D6676] tabular-nums">
          {place.pickedCount > 0
            ? `Terpilih ${place.pickedCount}×`
            : 'Belum pernah terpilih'}
        </span>

        {confirmingDelete ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onDelete(place.id)}
              className="min-h-[36px] px-3 py-1 rounded-lg bg-[#B83254] hover:bg-[#962542] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Hapus
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="min-h-[36px] px-2.5 py-1 rounded-lg bg-[#FFF2F5] hover:bg-[#FFE4EC] text-[#6B4454] text-xs font-medium transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(place)}
              aria-label={`Edit ${place.name}`}
              className="min-h-[40px] px-3 py-1.5 inline-flex items-center gap-1.5 rounded-lg text-xs font-medium text-[#6B4454] hover:text-[#3E202C] hover:bg-[#FFF2F5] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8527B]"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              aria-label={`Hapus ${place.name}`}
              className="min-h-[40px] px-3 py-1.5 inline-flex items-center gap-1.5 rounded-lg text-xs font-medium text-[#9D4A62] hover:text-[#B83254] hover:bg-[#FFF0F3] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8527B]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
