'use client';

import { useRouter } from 'next/router';

interface ArenaProps {
  arenaName: string; // 콘서트장 이름
  engName: string; // 콘서트장 영문 이름
  href: string; // 링크 URL
  imageSrc?: string; // 이미지 URL/경로
  imageAlt?: string; // 접근성을 위한 대체 텍스트
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
    <div onClick={() => router.push(href)} className={className}>
      <img src={imageSrc} alt={imageAlt} />
      <div>
        <div>{engName}</div>
        <div>{arenaName}</div>
      </div>
    </div>
  );
};
