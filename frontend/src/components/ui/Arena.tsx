'use client';
import Image from 'next/image';
import { LockClosedIcon } from '@heroicons/react/24/solid';

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
    <div
      onClick={!isDisabled ? onClick : undefined}
      className={`flex h-full flex-col items-center ${
        !isDisabled ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'
      } ${className}`}
    >
      <div className="relative h-24 w-24 overflow-hidden rounded-arena">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className={`h-full w-full object-cover transition-all ${
            isDisabled ? 'brightness-50' : ''
          }`}
          width={300}
          height={300}
        />
        {isDisabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <LockClosedIcon className="h-8 w-8 text-white/90" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center">
        <div
          className={`text-center font-pretendard text-caption2 font-bold ${
            isDisabled ? 'text-gray-400' : 'text-text-menu'
          }`}
        >
          {arenaName}
        </div>
      </div>
    </div>
  );
};
