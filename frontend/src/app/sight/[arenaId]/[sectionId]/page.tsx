'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import MiniMap from '@/components/sight/MiniMap/MiniMap';
import ReviewsBottomSheet from './ReviewsBottomSheet';
import SeatMap from '@/components/sight/SeatMap/SeatMap';
import TagButton from '@/components/common/TagButton/TagButton';
import styles from './page.module.scss';
import { useDispatch, useSelector } from '@/store';
import { resetSeats, setSeats } from '@/store/slices/seatSelectionSlice'; // setSeats 액션 추가
import { useSeatMap } from '@/hooks/useSeatMap'; // useSeatMap 훅 추가

// 바텀시트 위치 상태 타입 정의
type SheetPosition = 'full' | 'half' | 'closed';

export default function SectionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const selectedSeats = useSelector(
    (state) => state.seatSelection.selectedSeats
  );

  const arenaId = params.arenaId as string;
  const sectionId = params.sectionId as string;
  const section = sectionId.replace(new RegExp(`^${arenaId}`), '');

  // SeatMap과 동일한 데이터를 가져옴
  const { seatData, isLoading } = useSeatMap(arenaId, section);

  // 리뷰 바텀시트 위치 상태 (초기값: 'closed')
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>('closed');

  // 전체 좌석에 대한 리뷰 보기 + 전체 좌석 선택
  const handleShowAllReviews = (position: SheetPosition = 'half') => {
    // 바텀시트 위치 설정
    setSheetPosition(position);

    // 전체 좌석 선택
    if (seatData && !isLoading) {
      const allSeats = [];

      // 좌석 데이터에서 모든 유효한 좌석 추출
      for (const row of seatData.seatMap) {
        if (row.row !== '') {
          // 빈 행이 아닌 경우
          for (const seat of row.activeSeats) {
            if (seat.seat !== 0) {
              // 유효한 좌석인 경우
              allSeats.push({
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
      console.log('전체 좌석 선택됨:', allSeats.length, '개');
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

  // 선택된 좌석이 있는지 확인
  const hasSelectedSeats = selectedSeats.length > 0;

  // seatId 목록 생성 - ReviewsBottomSheet 컴포넌트에 맞게 형식 변환
  const selectedSeatIds = selectedSeats.map((seat) => seat.seatId.toString());

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <MiniMap arenaId={arenaId} currentSectionId={section} />

        <div className={styles.seatMapContainer}>
          <SeatMap arenaId={arenaId} sectionId={section} />
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
            type={hasSelectedSeats ? 'default' : 'disabled'} // 선택된 좌석이 있을 때만 활성화
            onClick={hasSelectedSeats ? handleReset : undefined} // 선택된 좌석이 있을 때만 클릭 가능
          >
            초기화
          </TagButton>
        </div>
      </div>

      {/* 리뷰 바텀시트 - 항상 렌더링하고 position으로 제어 */}
      <ReviewsBottomSheet
        arenaId={arenaId}
        sectionId={section}
        selectedSeats={selectedSeatIds}
        position={sheetPosition}
        onClose={handleCloseReviews}
      />
    </div>
  );
}
