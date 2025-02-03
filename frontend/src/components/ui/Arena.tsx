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
    <div onClick={onClick} className={`cursor-pointer ${className}`}>
      <div className="h-28 w-28 overflow-hidden rounded-2xl">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
          width={300}
          height={300}
        />
      </div>
      <div className="mt-2 w-28">
        <div className="text-center font-pretendard text-caption2 font-bold text-gray-900">
          {arenaName}
        </div>
      </div>
    </div>
  );
};
