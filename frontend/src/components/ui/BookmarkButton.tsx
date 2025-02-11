'use client';

import { BookmarkIcon as BookmarkFilled } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutlined } from '@heroicons/react/24/outline';

interface BookmarkButtonProps {
  isScraped: boolean;
  onScrapStateChange: (newScrapState: boolean) => Promise<boolean>;
}

export const BookmarkButton = ({
  isScraped,
  onScrapStateChange,
}: BookmarkButtonProps) => {
  const handleClick = async () => {
    const success = await onScrapStateChange(!isScraped);
    if (!success) {
      // API 호출이 실패하면 상태를 변경하지 않음
      return;
    }
  };

  const ButtonContent = isScraped ? BookmarkFilled : BookmarkOutlined;

  return (
    <button
      onClick={handleClick}
      className="group flex items-center justify-center focus:outline-none"
    >
      <ButtonContent
        className="group-hover:text-primary-600 h-6 w-6 text-primary-main transition-colors duration-normal"
        aria-label={isScraped ? 'Scrapped' : 'Not scrapped'}
      />
    </button>
  );
};
