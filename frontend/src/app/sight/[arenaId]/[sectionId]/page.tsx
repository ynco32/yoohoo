'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ReviewCard } from '@/components/sight/ReviewCard/ReviewCard';
import { ArtistGrade, ScreenGrade, StageGrade, Review } from '@/types/review';
import MiniMap from '@/components/sight/MiniMap/MiniMap';
import styles from './page.module.scss';
import ReviewsBottomSheet from './ReviewsBottomSheet';
import SeatMap from '@/components/sight/SeatMap/SeatMap';

// 바텀시트 위치 상태 타입 정의
type SheetPosition = 'full' | 'half' | 'closed';

export default function SectionPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const arenaId = params.arenaId as string;
  const sectionId = params.sectionId as string;
  const section = sectionId.replace(new RegExp(`^${arenaId}`), '');

  // URL 쿼리 파라미터에서 선택된 좌석 정보 가져오기
  const seatsParam = searchParams.get('seats');
  const selectedSeats = seatsParam ? seatsParam.split(',') : [];

  // 리뷰 바텀시트 위치 상태 (초기값: 'closed')
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>('closed');

  // 리뷰 바텀시트 열기 처리 - 위치 지정 가능
  const handleShowReviews = (position: SheetPosition = 'half') => {
    setSheetPosition(position);
  };

  // 리뷰 바텀시트 닫기 처리
  const handleCloseReviews = () => {
    setSheetPosition('closed');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <MiniMap arenaId={arenaId} currentSectionId={section} />

        <div className={styles.seatMapContainer}>
          <SeatMap arenaId={arenaId} sectionId={section} />
        </div>

        <div className={styles.buttons}>
          <button
            onClick={() => handleShowReviews('half')}
            className={styles.reviewButton}
          >
            이 구역 리뷰 보기
          </button>
        </div>
      </div>

      {/* 리뷰 바텀시트 - 항상 렌더링하고 position으로 제어 */}
      <ReviewsBottomSheet
        arenaId={arenaId}
        sectionId={section}
        selectedSeats={selectedSeats}
        position={sheetPosition}
        onClose={handleCloseReviews}
      />
    </div>
  );
}
