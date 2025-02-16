'use client';
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
  arenaName,
  imageSrc = '/images/cat.png',
  imageAlt = arenaName,
  className = '',
  onClick,
}: ArenaProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex h-full cursor-pointer flex-col items-center ${className}`}
    >
      <div className="rounded-arena h-24 w-24 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
          width={300}
          height={300}
        />
      </div>
      <div className="mt-2 flex items-center">
        <div className="text-center font-pretendard text-caption2 font-bold text-text-menu">
          {arenaName}
        </div>
      </div>
    </div>
  );
};
