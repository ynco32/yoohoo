'use client';
import { StarIcon as StarOutlined } from '@heroicons/react/24/outline';
import { StarIcon as StarFilled } from '@heroicons/react/24/solid';

interface ScrapButtonProps {
  isScrapMode: boolean;
}

export const ScrapButton = ({ isScrapMode }: ScrapButtonProps) => {
  if (isScrapMode) {
    return <StarFilled className="mb-3 h-8 w-8" aria-label="Scrap" />;
  }

  return (
    <>
      <StarOutlined className="mb-3 h-8 w-8" aria-label="Scrap" />
    </>
  );
};
