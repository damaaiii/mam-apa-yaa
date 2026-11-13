import React, { useState } from 'react';
import { Download, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#FFF2F5] hover:bg-[#FFE4EC] border border-[#E58BA6] text-[#AA3B63] text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#FFF2F5] hover:bg-[#FFE4EC] border border-[#E58BA6] text-[#AA3B63] text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>Pasang di Home Screen</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#3E202C]/40 backdrop-blur-xs p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl bg-[#FFF9FA] border border-[#F5D8E2] p-6 shadow-2xl animate-pop-in">
              <div className="flex items-center justify-between mb-3">
                <h3
                  id="ios-install-title"
                  className="font-display text-lg font-semibold text-[#3E202C]"
                >
                  Pasang di iPhone / iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Tutup panduan"
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-[#6B4454] hover:bg-[#FFE4EC] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ol className="space-y-2.5 text-sm text-[#6B4454] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-[#C8527B]">1.</span>
                  <span>
                    Ketuk ikon <strong className="text-[#3E202C] inline-flex items-center gap-1">Share <Share className="w-3.5 h-3.5 inline" /></strong> di toolbar Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-[#C8527B]">2.</span>
                  <span>
                    Gulir ke bawah lalu pilih{' '}
                    <strong className="text-[#3E202C]">Add to Home Screen</strong>.
                  </span>
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full min-h-[44px] rounded-xl bg-[#C8527B] hover:bg-[#AA3B63] text-white text-sm font-semibold cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
