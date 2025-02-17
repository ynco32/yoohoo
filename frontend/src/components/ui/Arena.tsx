import React from 'react';
import { LockClosedIcon } from '@heroicons/react/16/solid';
import Image from 'next/image';

interface ArenaProps {
  arenaId: number;
  arenaName: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
  onClick?: () => void;
}

export const Arena = ({
  arenaId,
  arenaName,
  imageSrc = '/images/cat.png',
  imageAlt = arenaName,
  className = '',
  onClick,
}: ArenaProps) => {
  const isDisabled = arenaId !== 1;

  return (
    <button
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      className={`group flex w-24 flex-col items-center ${
        !isDisabled ? 'cursor-pointer' : 'cursor-not-allowed'
      } ${className}`}
    >
      {/* Image Container - Fixed Height */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-arena">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className={`h-full w-full object-cover transition-all group-hover:opacity-80 ${
            isDisabled ? 'brightness-50' : ''
          }`}
          width={200}
          height={200}
        />
        {isDisabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <LockClosedIcon className="h-8 w-8 text-white/90" />
          </div>
        )}
      </div>

      {/* Text Container - Min Height for 2 Lines */}
      <div className="mt-2 min-h-[1.75rem] w-24 px-1">
        <span
          className={`line-clamp-2 text-center font-pretendard text-caption3 font-bold ${
            isDisabled ? 'text-gray-400' : 'text-text-menu'
          }`}
        >
          {arenaName}
        </span>
      </div>
    </button>
  );
};

export default Arena;
