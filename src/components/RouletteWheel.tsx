import React from 'react';
import { FoodPlace } from '../types/food';

interface RouletteWheelProps {
  items: FoodPlace[];
  rotation: number;
  isSpinning: boolean;
}

const SLICE_PALETTE = [
  { bg: '#FFE4EC', text: '#3E202C' },
  { bg: '#FFF5F7', text: '#3E202C' },
  { bg: '#FFC9DA', text: '#3E202C' },
  { bg: '#FFE9DC', text: '#3E202C' },
  { bg: '#F8D4E0', text: '#3E202C' },
  { bg: '#FFF9FA', text: '#3E202C' },
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function createSlicePath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M',
    cx,
    cy,
    'L',
    start.x,
    start.y,
    'A',
    r,
    r,
    0,
    largeArc,
    0,
    end.x,
    end.y,
    'Z',
  ].join(' ');
}

/**
 * Wraps full place names cleanly into balanced lines so names are never
 * truncated with ellipsis on the wheel.
 */
function wrapLabelLines(name: string, maxCharsPerLine: number): string[] {
  const clean = name.trim();
  if (clean.length <= maxCharsPerLine) return [clean];

  const words = clean.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (!current) {
      current = word;
    } else if ((current + ' ' + word).length <= maxCharsPerLine) {
      current = current + ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  // If a single very long word exceeded maxCharsPerLine, split it cleanly
  const expanded: string[] = [];
  for (const line of lines) {
    if (line.length <= maxCharsPerLine + 2) {
      expanded.push(line);
    } else {
      for (let i = 0; i < line.length; i += maxCharsPerLine) {
        expanded.push(line.slice(i, i + maxCharsPerLine));
      }
    }
  }

  return expanded.slice(0, 3);
}

export function RouletteWheel({ items, rotation, isSpinning }: RouletteWheelProps) {
  const count = items.length;
  const cx = 200;
  const cy = 200;
  const radius = 182;

  return (
    <div className="relative w-[272px] min-[360px]:w-[308px] sm:w-[376px] mx-auto select-none">
      {/* Top Pointer (Heart Ribbon Indicator) */}
      <div
        aria-hidden="true"
        className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none drop-shadow-md"
      >
        <svg width="34" height="38" viewBox="0 0 36 40" fill="none">
          <path
            d="M18 38L6 16C3.5 11.5 6.5 4 12.5 4C15.5 4 17.2 5.7 18 7.5C18.8 5.7 20.5 4 23.5 4C29.5 4 32.5 11.5 30 16L18 38Z"
            fill="#C8527B"
            stroke="#FFF9FA"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="14" r="3" fill="#FFF9FA" />
        </svg>
      </div>

      {/* Outer decorative rim */}
      <div className="relative rounded-full p-2 sm:p-2.5 bg-gradient-to-br from-[#FFD4E2] via-[#FFF2F5] to-[#F7B8CD] shadow-[0_14px_40px_rgba(200,82,123,0.18)] border-2 border-white">
        <div
          className="w-full aspect-square rounded-full overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? 'transform 4.2s cubic-bezier(0.12, 0.85, 0.16, 1)'
              : 'transform 0.35s ease-out',
            willChange: 'transform',
          }}
        >
          <svg viewBox="0 0 400 400" className="w-full h-full block">
            {count === 1 ? (
              <g>
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="#FFE4EC"
                  stroke="#E58BA6"
                  strokeWidth="3"
                />
                <text x={cx} y={cy - 76} textAnchor="middle" fontSize="34">
                  {items[0].emoji || '🍽️'}
                </text>
                {wrapLabelLines(items[0].name, 18).map((line, lIdx, arr) => (
                  <text
                    key={lIdx}
                    x={cx}
                    y={cy - 42 + lIdx * 18 - ((arr.length - 1) * 9)}
                    textAnchor="middle"
                    fill="#3E202C"
                    fontSize="14.5"
                    fontWeight="700"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {line}
                  </text>
                ))}
              </g>
            ) : (
              items.map((item, idx) => {
                const sliceAngle = 360 / count;
                const startAngle = idx * sliceAngle - sliceAngle / 2;
                const endAngle = startAngle + sliceAngle;
                const midAngle = idx * sliceAngle;
                const palette = SLICE_PALETTE[idx % SLICE_PALETTE.length];

                const fillColor =
                  count > 2 && idx === count - 1 && palette.bg === SLICE_PALETTE[0].bg
                    ? '#FFDFEA'
                    : palette.bg;

                const maxCharsPerLine = count >= 10 ? 11 : count >= 6 ? 13 : 15;
                const lines = wrapLabelLines(item.name, maxCharsPerLine);
                const longestLine = Math.max(...lines.map((l) => l.length));

                let fontSize = count >= 10 ? 9.5 : count >= 7 ? 10.5 : 12;
                if (longestLine > 12) fontSize = Math.min(fontSize, 9.5);
                if (lines.length >= 3) fontSize = Math.min(fontSize, 9);

                const emojiRadius = count >= 10 ? 156 : 152;
                const labelRadius = count >= 10 ? 102 : 104;
                const emojiPos = polarToCartesian(cx, cy, emojiRadius, midAngle);
                const textPos = polarToCartesian(cx, cy, labelRadius, midAngle);
                const lineHeight = fontSize + 2;

                return (
                  <g key={item.id}>
                    <path
                      d={createSlicePath(cx, cy, radius, startAngle, endAngle)}
                      fill={fillColor}
                      stroke="#F3B8CC"
                      strokeWidth="1.5"
                    />
                    <text
                      x={emojiPos.x}
                      y={emojiPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={count >= 10 ? '16' : '20'}
                      transform={`rotate(${midAngle}, ${emojiPos.x}, ${emojiPos.y})`}
                    >
                      {item.emoji || '🍽️'}
                    </text>
                    <text
                      x={textPos.x}
                      y={textPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={palette.text}
                      fontSize={fontSize}
                      fontWeight="600"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                      transform={`rotate(${midAngle - 90}, ${textPos.x}, ${textPos.y})`}
                    >
                      {lines.map((line, lIdx) => {
                        const dyOffset =
                          lIdx === 0
                            ? -((lines.length - 1) * lineHeight) / 2
                            : lineHeight;
                        return (
                          <tspan
                            key={lIdx}
                            x={textPos.x}
                            dy={dyOffset}
                          >
                            {line}
                          </tspan>
                        );
                      })}
                    </text>
                  </g>
                );
              })
            )}

            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="#E58BA6"
              strokeWidth="4"
            />
          </svg>
        </div>

        {/* Center Heart Hub */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-[#E58BA6] shadow-md flex items-center justify-center pointer-events-none"
        >
          <span className="text-lg sm:text-xl text-[#C8527B]">♡</span>
        </div>
      </div>
    </div>
  );
}
