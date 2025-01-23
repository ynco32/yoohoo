// Arena.tsx
'use client';

import { useRouter } from 'next/navigation';

interface ArenaProps {
  arenaName: string;
  engName: string;
  href: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export const Arena = ({
  arenaName,
  engName,
  href,
  imageSrc,
  imageAlt,
  className = '',
}: ArenaProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className={`cursor-pointer ${className}`}
    >
      <div className="h-28 w-28 overflow-hidden rounded-2xl">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-2 w-28">
        <div className="text-center font-pretendard text-caption2 font-bold text-gray-400">
          {engName}
        </div>
        <div className="text-center font-pretendard text-caption2 font-bold text-gray-900">
          {arenaName}
        </div>
      </div>
    </div>
  );
};
