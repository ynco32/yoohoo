import React from 'react';
import { useParams } from 'next/navigation';
import { useDraggableSheet } from '@/hooks/useDraggableSheet';
import { SightReviewCard } from './SightReviewCard';
import {
  SightReviewData,
  SeatDistanceStatus,
  SoundStatus,
} from '@/types/sightReviews';
import SeatScrapButton from '@/components/features/sight/seat/SeatScrapButton';
import { useSeatsStore } from '@/store/useSeatStore';
import { getUserProfileImage } from '@/lib/utils/profileCharacter';
import { useSectionStore } from '@/store/useSectionStore';

interface DraggableReviewSheetProps {
  position: 'full' | 'half' | 'closed';
  isLoading?: boolean;
  error?: string;
  onClose: () => void;
  reviewDataList: SightReviewData[];
  children?: React.ReactNode;
}

export const DraggableReviewSheet = ({
  position,
  onClose,
  reviewDataList,
  children,
  error,
  isLoading,
}: DraggableReviewSheetProps) => {
  const { getSectionById } = useSectionStore();
  const params = useParams();

  const currentStageType = Number(params.stageType);
  const currentSeatId = Number(params.seatId);
  const currentSectionId = Number(params.sectionId);

  const { getSeatScrapStatus, updateSeatScrapStatus, getSeatById } =
    useSeatsStore();
  const isScraped = currentSeatId ? getSeatScrapStatus(currentSeatId) : false;

  const { handlers, style } = useDraggableSheet({
    position,
    onClose,
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

  const currentRow = getSeatById(currentSeatId)?.row;

  const renderReviewContent = () => {
    if (isLoading) {
      return <div className="p-4">데이터를 불러오는 중입니다...</div>;
    }

    if (error) {
      return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4">
          <div className="mb-24 rounded-t-3xl bg-white">
            {reviewDataList.map((reviewData, index) => {
              if (
                !isSoundStatus(reviewData.sound) ||
                !isSeatDistanceStatus(reviewData.seatDistance)
              ) {
                return null;
              }

              return (
                <div
                  key={`${reviewData.seatId}-${reviewData.reviewId}-${index}`}
                  className="flex flex-col"
                >
                  <SightReviewCard
                    profilePicture={getUserProfileImage(reviewData.level)}
                    writerId={reviewData.userId}
                    concertTitle={reviewData.concertName}
                    nickName={reviewData.nickname ?? 'Unknown'}
                    reviewId={reviewData.reviewId}
                    seatInfo={`${reviewData.rowLine}열 ${reviewData.columnLine}번`}
                    image={reviewData.photoUrl}
                    content={reviewData.content}
                    viewQuality={reviewData.viewScore}
                    soundQuality={reviewData.sound}
                    seatDistance={reviewData.seatDistance}
                    writeTime={reviewData.writeTime}
                  />
                  {index < reviewDataList.length - 1 && (
                    <hr className="border-t border-gray-100" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50"
      style={{
        top: '3rem',
        pointerEvents: position === 'closed' ? 'none' : 'auto',
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          opacity: position === 'closed' ? 0 : 0.5,
          pointerEvents: position === 'closed' ? 'none' : 'auto',
        }}
        onClick={onClose}
      />

      {/* Sheet Container */}
      <div className="pointer-events-none relative h-full">
        <div className="mx-auto h-full max-w-layout px-2">
          <div
            className="pointer-events-auto h-full transform transition-transform duration-300 ease-out"
            style={style}
          >
            <div className="flex h-full flex-col overflow-hidden rounded-t-3xl bg-sight-bg shadow-lg">
              {/* Header */}
              <div className="flex-none">
                <div className="cursor-grab touch-none" {...handlers}>
                  <div className="py-2 pt-4">
                    <div className="mx-auto h-1 w-12 rounded-full bg-gray-300" />
                  </div>
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-title-bold text-gray-700">
                        리뷰보기
                      </h2>
                      <span className="text-body-bold text-primary-main">
                        {getSectionById(currentSectionId)?.sectionName}구역
                      </span>
                      {typeof currentSeatId === 'number' &&
                        !Number.isNaN(currentSeatId) && (
                          <>
                            <div className="h-1 w-1 rounded-full bg-gray-300" />
                            <span className="text-body text-gray-600">
                              {currentRow}열
                            </span>
                          </>
                        )}
                    </div>
                    {typeof currentSeatId === 'number' &&
                      !Number.isNaN(currentSeatId) && (
                        <div className="mb-2">
                          <SeatScrapButton
                            seatId={currentSeatId}
                            stageType={currentStageType}
                            initialScrapState={isScraped}
                            size="lg"
                            onScrap={handleScrap}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
                className="flex-1 touch-pan-y overflow-hidden"
                onTouchStart={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="h-full overflow-y-auto">
                  {children || renderReviewContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
