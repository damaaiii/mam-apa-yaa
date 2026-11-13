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

function truncateLabel(text: string, maxLen: number) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + '…';
}

export function RouletteWheel({ items, rotation, isSpinning }: RouletteWheelProps) {
  const count = items.length;
  const cx = 200;
  const cy = 200;
  const radius = 178;

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[390px] mx-auto select-none">
      {/* Top Pointer (Heart Ribbon Indicator) */}
      <div
        aria-hidden="true"
        className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none drop-shadow-md"
      >
        <svg width="36" height="40" viewBox="0 0 36 40" fill="none">
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

      {/* Outer decorative scalloped rim */}
      <div className="relative rounded-full p-2.5 bg-gradient-to-br from-[#FFD4E2] via-[#FFF2F5] to-[#F7B8CD] shadow-[0_14px_40px_rgba(200,82,123,0.18)] border-2 border-white">
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
                <text
                  x={cx}
                  y={cy - 68}
                  textAnchor="middle"
                  fontSize="36"
                >
                  {items[0].emoji || '🍽️'}
                </text>
                <text
                  x={cx}
                  y={cy - 34}
                  textAnchor="middle"
                  fill="#3E202C"
                  fontSize="15"
                  fontWeight="700"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {truncateLabel(items[0].name, 20)}
                </text>
              </g>
            ) : (
              items.map((item, idx) => {
                const sliceAngle = 360 / count;
                // Center slice idx at idx * sliceAngle (so slice 0 is centered at top 0 deg)
                const startAngle = idx * sliceAngle - sliceAngle / 2;
                const endAngle = startAngle + sliceAngle;
                const midAngle = idx * sliceAngle;
                const palette = SLICE_PALETTE[idx % SLICE_PALETTE.length];

                // Ensure last slice doesn't match first slice color when even/odd aligns
                const fillColor =
                  count > 2 && idx === count - 1 && palette.bg === SLICE_PALETTE[0].bg
                    ? '#FFDFEA'
                    : palette.bg;

                const labelRadius = count >= 10 ? 116 : 112;
                const emojiRadius = count >= 10 ? 148 : 144;
                const emojiPos = polarToCartesian(cx, cy, emojiRadius, midAngle);
                const textPos = polarToCartesian(cx, cy, labelRadius, midAngle);
                const fontSize = count >= 10 ? 10.5 : count >= 7 ? 11.5 : 13;
                const maxChars = count >= 10 ? 11 : count >= 7 ? 13 : 16;

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
                      fontSize={count >= 10 ? '18' : '22'}
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
                      {truncateLabel(item.name, maxChars)}
                    </text>
                  </g>
                );
              })
            )}

            {/* Outer ring border */}
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white border-2 border-[#E58BA6] shadow-md flex items-center justify-center pointer-events-none"
        >
          <span className="text-xl text-[#C8527B]">♡</span>
        </div>
      </div>
    </div>
  );
}
