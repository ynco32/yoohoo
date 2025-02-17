/**
 * 공연장 선택 버튼 컴포넌트
 * @description
 * - 공연장 이미지와 이름을 보여주는 클릭 가능한 버튼
 * - 원형 이미지와 2줄 제한된 공연장 이름 표시
 * - 기본 이미지와 대체 텍스트 지원
 */

'use client';
import Image from 'next/image';

/**
 * Arena 컴포넌트 Props 인터페이스
 * @interface ArenaProps
 * @property {number} arenaId - 공연장 고유 ID
 * @property {string} arenaName - 공연장 이름
 * @property {string} imageSrc - 공연장 이미지 URL
 * @property {string} imageAlt - 이미지 대체 텍스트
 * @property {string} [className] - 추가 스타일 클래스
 * @property {() => void} [onClick] - 클릭 이벤트 핸들러
 */
interface ArenaProps {
  arenaId: number;
  arenaName: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
  onClick?: () => void;
}

/**
 * 공연장 선택 버튼 컴포넌트
 * @param {ArenaProps} props - 컴포넌트 속성
 * @returns {JSX.Element} 공연장 선택 버튼
 */
export const Arena = ({
  arenaName,
  imageSrc = '/images/cat.png', // 기본 이미지 경로
  imageAlt = arenaName, // 이미지 대체 텍스트 기본값
  className = '', // 추가 스타일 클래스 기본값
  onClick,
}: ArenaProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex h-40 cursor-pointer flex-col items-center ${className}`}
    >
      {/* 공연장 이미지 컨테이너 - 원형 마스크 적용 */}
      <div className="h-24 w-24 overflow-hidden rounded-arena">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
          width={300}
          height={300}
        />
      </div>
      {/* 공연장 이름 컨테이너 - 2줄 제한 */}
      <div className="mt-2 flex min-h-[3rem] items-center">
        <div className="line-clamp-2 max-w-[96px] text-center font-pretendard text-caption2 font-bold text-text-menu">
          {arenaName}
        </div>
      </div>
    </div>
  );
};
