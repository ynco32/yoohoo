import React, { useState, useEffect, useRef } from 'react';
import { SightReviewCard } from './SightReviewCard';
import { useParams } from 'next/navigation';

// 타입 정의
type SeatDistanceStatus = '좁아요' | '평범해요' | '넓어요';
type SoundStatus = '잘 안 들려요' | '평범해요' | '선명해요';

interface SightReviewData {
  arenaId: number;
  sectionId: number;
  seatId: number;
  concertTitle: string;
  nickName: string;
  profilePicture: string;
  seatInfo: string;
  images: string[];
  content: string;
  viewQuality: number;
  soundQuality: string;
  seatQuality: string;
}

interface DraggableReviewSheetProps {
  isOpen: boolean;
  onClose: () => void;
  reviewDataList: SightReviewData[];
}

export const DraggableReviewSheet = ({
  isOpen,
  onClose,
  reviewDataList,
}: DraggableReviewSheetProps) => {
  const [position, setPosition] = useState('half');
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [currentTranslate, setCurrentTranslate] = useState(50);
  const sheetRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const currentSectionId = Number(params.sectionId);
  const currentSeatId = Number(params.seatId);

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStart === null) return;

    const currentPosition = e.touches[0].clientY;
    const diff = currentPosition - dragStart;

    const windowHeight = window.innerHeight;
    const percentage = (diff / windowHeight) * 100;

    let newTranslate = currentTranslate + percentage;
    newTranslate = Math.max(0, Math.min(90, newTranslate));

    setCurrentTranslate(newTranslate);
  };

  const handleTouchEnd = () => {
    setDragStart(null);

    if (currentTranslate < 25) {
      setPosition('full');
      setCurrentTranslate(0);
    } else if (currentTranslate < 75) {
      setPosition('half');
      setCurrentTranslate(50);
    } else {
      setPosition('closed');
      setCurrentTranslate(90);
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setPosition('half');
      setCurrentTranslate(50);
    } else {
      setPosition('closed');
      setCurrentTranslate(90);
    }
  }, [isOpen]);

  // 타입 가드 함수들
  const isSoundStatus = (value: string): value is SoundStatus => {
    return ['잘 안 들려요', '평범해요', '선명해요'].includes(value);
  };

  const isSeatDistanceStatus = (value: string): value is SeatDistanceStatus => {
    return ['좁아요', '평범해요', '넓어요'].includes(value);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center">
      <div className="relative h-full w-full max-w-md">
        <div
          className="pointer-events-auto absolute bottom-0 w-full transform px-4 transition-transform duration-300 ease-out"
          style={{
            transform: `translateY(${currentTranslate}%)`,
            touchAction: 'none',
          }}
          ref={sheetRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full rounded-t-3xl bg-sight-bg shadow-lg">
            <div className="py-2 pt-4">
              <div className="mx-auto h-1 w-12 rounded-full bg-gray-300" />
            </div>

            <div className="">
              <div className="flex items-center gap-2 px-6 py-2">
                <h2 className="text-title-bold text-gray-700">리뷰보기</h2>
                <span className="text-body-bold text-primary-main">
                  {currentSectionId}구역
                </span>
                {currentSeatId !== 0 && (
                  <>
                    <div className="h-1 w-1 rounded-full bg-gray-300" />
                    <span className="text-body text-gray-600">
                      {currentSeatId}열
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="h-[90vh] overflow-y-auto">
              <div className="space-y-4 px-4">
                {reviewDataList.map((reviewData, index) => {
                  // 타입 검증
                  if (!isSoundStatus(reviewData.soundQuality)) {
                    console.warn(
                      `Invalid sound quality value: ${reviewData.soundQuality}`
                    );
                    return null;
                  }
                  if (!isSeatDistanceStatus(reviewData.seatQuality)) {
                    console.warn(
                      `Invalid seat quality value: ${reviewData.seatQuality}`
                    );
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableReviewSheet;
