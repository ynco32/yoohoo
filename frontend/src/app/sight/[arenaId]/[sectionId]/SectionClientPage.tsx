'use client';

import { useState } from 'react';
import MiniMap from '@/components/sight/MiniMap/MiniMap';
import ReviewsBottomSheet from './ReviewsBottomSheet';
import SeatMap from '@/components/sight/SeatMap/SeatMap';
import TagButton from '@/components/common/TagButton/TagButton';
import styles from './page.module.scss';
import { useDispatch, useSelector } from '@/store';
import { resetSeats, setSeats } from '@/store/slices/seatSelectionSlice';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

// 바텀시트 위치 상태 타입 정의
type SheetPosition = 'full' | 'half' | 'closed';

interface ClientSectionPageProps {
  arenaId: string;
  sectionId: string;
  initialSeatData: any; // 서버에서 로드한 좌석 데이터
}

export default function ClientSectionPage({
  arenaId,
  sectionId,
  initialSeatData,
}: ClientSectionPageProps) {
  const dispatch = useDispatch();
  const selectedSeats = useSelector(
    (state) => state.seatSelection.selectedSeats
  );

  // 확대/축소 상태 추적
  const [isZoomed, setIsZoomed] = useState(false);

  // 리뷰 바텀시트 위치 상태 (초기값: 'closed')
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>('closed');

  // 전체 좌석에 대한 리뷰 보기 + 전체 좌석 선택
  const handleShowAllReviews = (position: SheetPosition = 'half') => {
    // 바텀시트 위치 설정
    setSheetPosition(position);

    // 전체 좌석 선택
    if (initialSeatData && initialSeatData.seatMap) {
      const allSeats = [];

      // 좌석 데이터에서 모든 유효한 좌석 추출
      for (const row of initialSeatData.seatMap) {
        if (row.row !== '') {
          for (const seat of row.activeSeats) {
            if (seat.seat !== 0) {
              allSeats.push({
                arenaId: arenaId,
                sectionId: sectionId,
                row: row.row,
                seat: seat.seat,
                seatId: seat.seatId,
              });
            }
          }
        }
      }

      // 리덕스 상태 업데이트
      dispatch(setSeats(allSeats));
    }
  };

  // 선택된 좌석 초기화
  const handleReset = () => {
    dispatch(resetSeats());
  };

  // 리뷰 바텀시트 닫기 처리
  const handleCloseReviews = () => {
    setSheetPosition('closed');
  };

  // 현재 구역에 대한 선택된 좌석만 필터링
  const currentSectionSelectedSeats = selectedSeats.filter(
    (seat) => seat.arenaId === arenaId && seat.sectionId === sectionId
  );

  // 선택된 좌석이 있는지 확인 (현재 구역에서만)
  const hasSelectedSeats = currentSectionSelectedSeats.length > 0;

  // 현재 구역의 seatId 목록 생성 - ReviewsBottomSheet 컴포넌트에 맞게 형식 변환
  const selectedSeatIds = currentSectionSelectedSeats.map((seat) =>
    seat.seatId.toString()
  );

  return (
    <>
      <MiniMap arenaId={arenaId} currentSectionId={sectionId} />

      <div className={styles.seatMapContainer}>
        <SeatMap
          arenaId={arenaId}
          sectionId={sectionId}
          initialSeatData={initialSeatData}
        />
      </div>

      <div className={styles.buttons}>
        <TagButton
          type='active'
          iconName='check-box'
          onClick={handleShowAllReviews}
        >
          전체 좌석 리뷰 보기
        </TagButton>
        <TagButton
          type={hasSelectedSeats ? 'default' : 'disabled'}
          onClick={hasSelectedSeats ? handleReset : undefined}
        >
          초기화
        </TagButton>
      </div>

      {/* 리뷰 바텀시트 - 항상 렌더링하고 position으로 제어 */}
      <ReviewsBottomSheet
        arenaId={arenaId}
        sectionId={sectionId}
        selectedSeats={selectedSeatIds}
        position={sheetPosition}
        onClose={handleCloseReviews}
      />
    </>
  );
}
