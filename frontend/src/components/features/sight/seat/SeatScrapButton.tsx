import React, { useState } from 'react';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useSeatsStore } from '@/store/useSeatStore';

interface SeatScrapButtonProps {
  seatId: number;
  stageType: number;
  initialScrapState: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onScrap?: (isScrapped: boolean) => void;
}

const SeatScrapButton: React.FC<SeatScrapButtonProps> = ({
  seatId,
  stageType,
  size = 'md',
  initialScrapState,
  className = '',
  onScrap,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScraped, setIsScraped] = useState(initialScrapState);

  // store에서 액션 가져오기
  const updateSeatScrapStatus = useSeatsStore(
    (state) => state.updateSeatScrapStatus
  );

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  };

  const getVariantClasses = (scraped: boolean) => {
    return scraped
      ? 'bg-background-alt hover:bg-gray-50 rounded-full transition-colors duration-normal'
      : 'text-gray-500 hover:text-primary-main transition-colors duration-normal';
  };

  const handleScrapStateChange = async (newScrapState: boolean) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/v1/view/scraps/${seatId}?stageType=${stageType}`,
        {
          method: newScrapState ? 'POST' : 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          newScrapState ? 'Failed to add scrap' : 'Failed to remove scrap'
        );
      }

      const data = await response.json();
      setIsScraped(data.isScraped);
      // store의 좌석 상태 업데이트
      updateSeatScrapStatus(seatId, data.isScraped);
      onScrap?.(data.isScraped);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update scrap status'
      );
      return false;
    } finally {
      setIsLoading(false);
    }

    return true;
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${sizeClasses[size]} ${getVariantClasses(isScraped)} ${isLoading ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      title={error || undefined}
    >
      {isLoading ? (
        <ArrowPathIcon className="h-5 w-5 animate-spin" />
      ) : (
        <BookmarkButton
          isScraped={isScraped}
          onScrapStateChange={handleScrapStateChange}
        />
      )}
    </div>
  );
};

export default SeatScrapButton;
