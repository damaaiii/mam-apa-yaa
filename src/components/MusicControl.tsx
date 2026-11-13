import React, { useEffect, useRef, useState } from 'react';
import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { bgmController } from '../utils/bgm';

export function MusicControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => bgmController.getVolume());
  const [showPopover, setShowPopover] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowPopover(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      bgmController.pause();
      setIsPlaying(false);
    } else {
      await bgmController.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = parseFloat(e.target.value);
    setVolume(next);
    bgmController.setVolume(next);
  };

  const handleToggleMute = () => {
    if (volume > 0) {
      setVolume(0);
      bgmController.setVolume(0);
    } else {
      setVolume(0.45);
      bgmController.setVolume(0.45);
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-1 shrink-0">
      {/* Direct Play / Pause Button */}
      <button
        type="button"
        onClick={handleTogglePlay}
        aria-label={isPlaying ? 'Jeda musik latar' : 'Putar musik latar'}
        title={isPlaying ? 'Jeda musik' : 'Putar musik romantis'}
        className={`min-h-[38px] md:min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
          isPlaying
            ? 'bg-[#FFE4EC] border-[#E58BA6] text-[#AA3B63]'
            : 'bg-white hover:bg-[#FFF2F5] border-[#F0CCD8] text-[#6B4454]'
        }`}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 shrink-0 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 shrink-0 fill-current" />
        )}
        <span className="hidden sm:inline">
          {isPlaying ? 'Music On' : 'Music'}
        </span>
      </button>

      {/* Volume Drawer Trigger */}
      <button
        type="button"
        onClick={() => setShowPopover((prev) => !prev)}
        aria-label="Atur volume musik"
        aria-expanded={showPopover}
        className="min-w-[38px] min-h-[38px] md:min-w-[40px] md:min-h-[40px] flex items-center justify-center rounded-xl bg-white hover:bg-[#FFF2F5] border border-[#F0CCD8] text-[#6B4454] transition-colors cursor-pointer"
      >
        {volume === 0 ? (
          <VolumeX className="w-4 h-4 text-[#8D6676]" />
        ) : (
          <Volume2 className="w-4 h-4 text-[#C8527B]" />
        )}
      </button>

      {/* Volume Control Popover */}
      {showPopover && (
        <div
          role="region"
          aria-label="Pengaturan volume musik"
          className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white border border-[#F5D8E2] shadow-xl p-4 z-50 animate-pop-in"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3E202C]">
              <Music className="w-3.5 h-3.5 text-[#C8527B]" />
              <span>Musik Latar</span>
            </div>
            <span className="text-xs font-semibold text-[#AA3B63] tabular-nums">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleMute}
              aria-label={volume === 0 ? 'Bunyikan musik' : 'Bisukan musik'}
              className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-[#FFF2F5] text-[#C8527B] cursor-pointer"
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Volume musik latar"
              className="w-full accent-[#C8527B] cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={handleTogglePlay}
            className="mt-3 w-full min-h-[38px] rounded-xl bg-[#FFF2F5] hover:bg-[#FFE4EC] text-[#AA3B63] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Jeda Musik</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Putar Musik</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
