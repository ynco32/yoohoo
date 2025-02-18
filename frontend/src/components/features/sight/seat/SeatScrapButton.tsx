import React, { useState, useEffect } from 'react';
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

  // store에서 상태와 액션 가져오기
  const updateSeatScrapStatus = useSeatsStore(
    (state) => state.updateSeatScrapStatus
  );
  const seatScrapStatus = useSeatsStore(
    (state) => state.seats[seatId]?.scrapped
  );

  // store의 상태가 변경될 때마다 UI 업데이트
  const [isScraped, setIsScraped] = useState(initialScrapState);

  useEffect(() => {
    if (seatScrapStatus !== undefined) {
      setIsScraped(seatScrapStatus);
    }
  }, [seatScrapStatus]);

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'py-3',
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

      // 낙관적 업데이트: API 호출 전에 UI 먼저 업데이트
      setIsScraped(newScrapState);
      updateSeatScrapStatus(seatId, newScrapState);

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
        // API 호출이 실패하면 상태를 원래대로 되돌림
        setIsScraped(!newScrapState);
        updateSeatScrapStatus(seatId, !newScrapState);
        throw new Error(
          newScrapState ? 'Failed to add scrap' : 'Failed to remove scrap'
        );
      }

      const data = await response.json();
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
