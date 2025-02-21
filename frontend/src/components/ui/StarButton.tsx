'use client';
import { StarIcon as StarOutlined } from '@heroicons/react/24/outline';
import { StarIcon as StarFilled } from '@heroicons/react/24/solid';
import { useScrapStore } from '@/store/useScrapStore';

interface StarButtonProps {
  onScrapModeChange?: (isScrap: boolean) => void;
}

export const StarButton = ({ onScrapModeChange }: StarButtonProps) => {
  const { isScrapMode, toggleScrapMode } = useScrapStore();

  const handleClick = () => {
    toggleScrapMode();
    onScrapModeChange?.(!isScrapMode);
  };

  const ButtonContent = isScrapMode ? StarFilled : StarOutlined;

  return (
    <button
      onClick={handleClick}
      className="mx-auto rounded-full bg-white p-3 shadow-lg"
    >
      <div className="flex flex-row items-center gap-2">
        <ButtonContent className={`text-star h-8 w-8`} aria-label="Scrap" />
        <span>스크랩 보기</span>
      </div>
    </button>
  );
};
