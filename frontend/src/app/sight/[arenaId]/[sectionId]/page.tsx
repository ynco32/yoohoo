'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ReviewCard } from '@/components/sight/ReviewCard/ReviewCard';
import { ArtistGrade, ScreenGrade, StageGrade, Review } from '@/types/review';
import MiniMap from '@/components/sight/MiniMap/MiniMap';
import styles from './page.module.scss';
import ReviewsBottomSheet from './ReviewsBottomSheet';

// 바텀시트 위치 상태 타입 정의
type SheetPosition = 'full' | 'half' | 'closed';

export default function SectionPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const arenaId = params.arenaId as string;
  const sectionId = params.sectionId as string;

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

  // 테스트용 좌석 선택 버튼
  const handleSelectSeatButtonClick = (seatId: string) => {
    // 현재 URL을 기준으로 새 URL 생성
    const url = new URL(window.location.href);

    const newSelectedSeats = [...selectedSeats];
    if (newSelectedSeats.includes(seatId)) {
      const index = newSelectedSeats.indexOf(seatId);
      newSelectedSeats.splice(index, 1);
    } else {
      newSelectedSeats.push(seatId);
    }

    if (newSelectedSeats.length > 0) {
      url.searchParams.set('seats', newSelectedSeats.join(','));
    } else {
      url.searchParams.delete('seats');
    }

    window.history.pushState({}, '', url);
  };

  return (
    <div className={styles.container}>
      <MiniMap arenaId={arenaId} currentSectionId='1' />
      <h1>공연장 좌석 정보</h1>
      <p>선택된 구역: {sectionId}구역</p>
      <p>바텀시트 표시 상태: {sheetPosition}</p> {/* 디버깅 */}
      {/* 테스트용 UI */}
      <div className={styles.testControls}>
        <h2>테스트 컨트롤</h2>
        <div>
          <p>
            선택된 좌석:{' '}
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : '없음'}
          </p>
          <div className={styles.seatButtons}>
            <button
              onClick={() => handleSelectSeatButtonClick('101')}
              className={
                selectedSeats.includes('101') ? styles.selectedSeat : ''
              }
            >
              좌석 101 선택/해제
            </button>
            <button
              onClick={() => handleSelectSeatButtonClick('102')}
              className={
                selectedSeats.includes('102') ? styles.selectedSeat : ''
              }
            >
              좌석 102 선택/해제
            </button>
            <button
              onClick={() => handleSelectSeatButtonClick('150')}
              className={
                selectedSeats.includes('150') ? styles.selectedSeat : ''
              }
            >
              좌석 150 선택/해제
            </button>
          </div>
        </div>

        {/* 리뷰 보기 버튼 그룹 */}
        <div className={styles.sheetControls}>
          <button
            onClick={() => handleShowReviews('half')}
            className={styles.reviewButton}
          >
            리뷰 바텀시트 열기 (half)
          </button>
          <button
            onClick={() => handleShowReviews('full')}
            className={styles.reviewButton}
          >
            리뷰 바텀시트 열기 (full)
          </button>
          <button onClick={handleCloseReviews} className={styles.reviewButton}>
            리뷰 바텀시트 닫기
          </button>
        </div>
      </div>
      {/* 리뷰 바텀시트 - 항상 렌더링하고 position으로 제어 */}
      <ReviewsBottomSheet
        arenaId={arenaId}
        sectionId={sectionId}
        selectedSeats={selectedSeats}
        position={sheetPosition}
        onClose={handleCloseReviews}
      />
    </div>
  );
}
