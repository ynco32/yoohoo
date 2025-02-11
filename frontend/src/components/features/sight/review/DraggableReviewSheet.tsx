import React from 'react';
import { useParams } from 'next/navigation';
import { useDraggableSheet } from '@/hooks/useDraggableSheet';
import { SightReviewCard } from './SightReviewCard';
import { SightReviewData } from '@/types/sightReviews';
import SeatScrapButton from '@/components/features/sight/seat/SeatScrapButton';
import { useSeatsStore } from '@/store/useSeatStore';

type SeatDistanceStatus = '좁아요' | '평범해요' | '넓어요';
type SoundStatus = '잘 안 들려요' | '평범해요' | '선명해요';

interface DraggableReviewSheetProps {
  isOpen: boolean;
  isLoading?: boolean;
  error?: string;
  onClose: () => void;
  reviewDataList: SightReviewData[];
  children?: React.ReactNode;
}

export const DraggableReviewSheet = ({
  isOpen,
  onClose,
  reviewDataList,
  children,
  error,
  isLoading,
}: DraggableReviewSheetProps) => {
  const params = useParams();
  const currentSectionId = Number(params.sectionId);
  const currentStageType = Number(params.stageType);
  const currentSeatId = Number(params.seatId);

  // Zustand store hooks
  const { getSeatScrapStatus, updateSeatScrapStatus } = useSeatsStore();
  const isScraped = currentSeatId ? getSeatScrapStatus(currentSeatId) : false;

  const { handlers, style } = useDraggableSheet({
    isOpen,
    onClose,
    initialPosition: 'half',
  });

  const isSoundStatus = (value: string): value is SoundStatus => {
    return ['잘 안 들려요', '평범해요', '선명해요'].includes(value);
  };

  const isSeatDistanceStatus = (value: string): value is SeatDistanceStatus => {
    return ['좁아요', '평범해요', '넓어요'].includes(value);
  };

  const handleScrap = (isScrapped: boolean) => {
    if (currentSeatId) {
      updateSeatScrapStatus(currentSeatId, isScrapped);
    }
  };

  const renderReviewContent = () => {
    if (isLoading) {
      return <div className="p-4">데이터를 불러오는 중입니다...</div>;
    }

    if (error) {
      return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
      <div className="space-y-4 px-4">
        {reviewDataList.map((reviewData, index) => {
          if (
            !isSoundStatus(reviewData.soundQuality) ||
            !isSeatDistanceStatus(reviewData.seatQuality)
          ) {
            return null;
          }

          return (
            <div
              key={`${reviewData.sectionId}-${reviewData.seatId}-${index}`}
              className="flex flex-col rounded-t-3xl bg-white"
            >
              <SightReviewCard
                concertTitle={reviewData.concertTitle}
                nickName={reviewData.nickName}
                profilePicture={reviewData.profilePicture}
                seatInfo={reviewData.seatInfo}
                images={reviewData.images}
                content={reviewData.content}
                viewQuality={reviewData.viewQuality}
                soundQuality={reviewData.soundQuality}
                seatQuality={reviewData.seatQuality}
              />
              {index < reviewDataList.length - 1 && (
                <hr className="my-4 border-t border-gray-100" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center">
      <div className="relative h-full w-full max-w-md">
        <div
          className="pointer-events-auto absolute bottom-0 w-full transform px-4 transition-transform duration-300 ease-out"
          style={style}
          {...handlers}
        >
          <div className="relative w-full rounded-t-3xl bg-sight-bg shadow-lg">
            <div className="py-2 pt-4">
              <div className="mx-auto h-1 w-12 rounded-full bg-gray-300" />
            </div>

            <div className="flex items-center justify-between px-6 py-2">
              <div className="flex items-center gap-2">
                <h2 className="text-title-bold text-gray-700">리뷰보기</h2>
                <span className="text-body-bold text-primary-main">
                  {currentSectionId}구역
                </span>
                {typeof currentSeatId === 'number' &&
                  !Number.isNaN(currentSeatId) && (
                    <>
                      <div className="h-1 w-1 rounded-full bg-gray-300" />
                      <span className="text-body text-gray-600">
                        {currentSeatId}열
                      </span>
                    </>
                  )}
              </div>

              {typeof currentSeatId === 'number' &&
                !Number.isNaN(currentSeatId) && (
                  <SeatScrapButton
                    seatId={currentSeatId}
                    stageType={currentStageType}
                    initialScrapState={isScraped}
                    size="lg"
                    variant="contained"
                    onScrap={handleScrap}
                  />
                )}
            </div>

            <div className="h-[90vh] overflow-y-auto">
              {children || renderReviewContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
