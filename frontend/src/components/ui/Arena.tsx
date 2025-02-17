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
      className={`flex h-40 cursor-pointer flex-col items-center ${className}`}
    >
      <div className="h-24 w-24 overflow-hidden rounded-arena">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
          width={300}
          height={300}
        />
      </div>
      <div className="mt-2 flex min-h-[3rem] items-center">
        <div className="line-clamp-2 max-w-[96px] text-center font-pretendard text-caption2 font-bold text-text-menu">
          {arenaName}
        </div>
      </div>
    </div>
  );
};
