import React, { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

export function RibbonBow({ className = 'w-7 h-5 text-[#D8688C]' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M19.5 13.5C15.5 7.5 7 3.5 4.5 7.5C2 11.5 9.5 16.5 18.5 14.5"
        fill="#FFD4E2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.5 13.5C24.5 7.5 33 3.5 35.5 7.5C38 11.5 30.5 16.5 21.5 14.5"
        fill="#FFD4E2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 15.5L11.5 24.5L15.5 23L18.5 25.5L19.8 16"
        fill="#FFE6EE"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.5 15.5L28.5 24.5L24.5 23L21.5 25.5L20.2 16"
        fill="#FFE6EE"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="20"
        cy="14"
        r="3"
        fill="#E58BA6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function SparkleDoodle({ className = 'w-4 h-4 text-[#E58BA6]' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
    </svg>
  );
}

export function HeartDoodle({ className = 'w-4 h-4 text-[#E58BA6]' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20.5C12 20.5 4 15.1 4 9.3C4 6.6 6.1 4.5 8.7 4.5C10.3 4.5 11.4 5.3 12 6.4C12.6 5.3 13.7 4.5 15.3 4.5C17.9 4.5 20 6.6 20 9.3C20 15.1 12 20.5 12 20.5Z" />
    </svg>
  );
}

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'What to Eat with Mas?',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF2F5] via-[#FFE4EC] to-[#FFF9FA] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <RibbonBow className="w-10 h-7 text-[#C8527B] mb-3" />
        <UtensilsCrossed className="w-8 h-8 text-[#C8527B] mb-2" />
        <span className="font-display text-sm font-semibold text-[#3E202C]">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
