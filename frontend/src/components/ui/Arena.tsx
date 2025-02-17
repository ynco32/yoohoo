/**
 * 공연장 선택 버튼 컴포넌트
 * @description
 * - 공연장 이미지와 이름을 보여주는 클릭 가능한 버튼
 * - 원형 이미지와 2줄 제한된 공연장 이름 표시
 * - 기본 이미지와 대체 텍스트 지원
 */

'use client';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
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
  arenaId,
  arenaName,
  imageSrc = '/images/cat.png', // 기본 이미지 경로
  imageAlt = arenaName, // 이미지 대체 텍스트 기본값
  className = '', // 추가 스타일 클래스 기본값
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
