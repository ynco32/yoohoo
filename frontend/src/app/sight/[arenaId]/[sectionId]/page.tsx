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

// 마지막 선택된 좌석 정보를 위한 타입 추가
type LastSelectedSeat = {
  row: string;
  column: number;
} | null;

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

  // 마지막 선택된 좌석 정보 상태 추가
  const [lastSelectedSeat, setLastSelectedSeat] =
    useState<LastSelectedSeat>(null);

  // 좌석이 선택되면 바텀시트 포지션을 half로 변경하고 마지막 선택 좌석 업데이트
  useEffect(() => {
    if (selectedSeats.length > 0) {
      setSheetPosition('half');

      // 마지막 선택된 좌석 정보 저장
      const lastSeat = selectedSeats[selectedSeats.length - 1];
      setLastSelectedSeat({
        row: lastSeat.row,
        column: lastSeat.seat,
      });
    } else {
      setLastSelectedSeat(null);
    }
  }, [selectedSeats]);

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

      // 전체 좌석 중 첫 번째 좌석을 마지막 선택 좌석으로 설정
      if (allSeats.length > 0) {
        setLastSelectedSeat({
          row: allSeats[0].row,
          column: allSeats[0].seat,
        });
      }
    }
  };

  // 선택된 좌석 초기화
  const handleReset = () => {
    dispatch(resetSeats());
    setSheetPosition('closed'); // 초기화 시 바텀시트도 닫기
    setLastSelectedSeat(null); // 마지막 선택 좌석 정보도 초기화
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

      {/* 리뷰 바텀시트 - 마지막 선택된 좌석 정보 전달 */}
      <ReviewsBottomSheet
        arenaId={arenaId}
        sectionId={section}
        selectedSeats={selectedSeatIds}
        position={sheetPosition}
        onClose={handleCloseReviews}
        lastSelectedSeat={lastSelectedSeat}
      />
    </div>
  );
}
