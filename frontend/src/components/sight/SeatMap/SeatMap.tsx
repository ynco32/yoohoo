import React, { useState, useRef, useEffect } from 'react';
import Seat from '@/components/sight/Seat/Seat';
import styles from './SeatMap.module.scss';
import { useSeatMap } from '@/hooks/useSeatMap';

interface SelectedSeat {
  row: string;
  seat: number;
}

interface SeatMapProps {
  arenaId: string;
  sectionId: string;
  maxWidth?: number; // 최대 너비를 props로 받을 수 있도록 추가
}

const SeatMap: React.FC<SeatMapProps> = ({
  arenaId,
  sectionId,
  maxWidth = 800,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const { seatData, isLoading, error } = useSeatMap(arenaId, sectionId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // 좌석 선택 처리 함수
  const handleSeatClick = (row: string, seatNumber: number) => {
    const isAlreadySelected = selectedSeats.some(
      (selected) => selected.row === row && selected.seat === seatNumber
    );

    if (isAlreadySelected) {
      setSelectedSeats(
        selectedSeats.filter(
          (selected) => !(selected.row === row && selected.seat === seatNumber)
        )
      );
    } else {
      setSelectedSeats([...selectedSeats, { row, seat: seatNumber }]);
    }
  };

  // 좌석이 선택되었는지 확인하는 함수
  const isSeatSelected = (row: string, seatNumber: number) => {
    return selectedSeats.some(
      (selected) => selected.row === row && selected.seat === seatNumber
    );
  };

  // 빈 행 여부 확인 함수
  const isEmptyRow = (row: any) => row.row === '';

  if (isLoading) {
    return <div className={styles.container}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  if (!seatData) {
    return <div className={styles.container}>좌석 정보가 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.scrollHint}>
        좌우로 스크롤하여 모든 좌석을 확인하세요
      </div>

      <div
        className={styles.seatMapContainer}
        style={{ maxWidth: `${maxWidth}px` }}
      >
        <div className={styles.rowNumberColumn}>
          {seatData.seatMap.map((row, rowIndex) =>
            !isEmptyRow(row) ? (
              <div
                key={`row-number-${row.row}`}
                className={styles.rowNumberCell}
              >
                {row.row}
              </div>
            ) : (
              <div
                key={`empty-number-${rowIndex}`}
                className={styles.emptyRowNumber}
              ></div>
            )
          )}
        </div>

        <div className={styles.seatsContainer} ref={scrollContainerRef}>
          {seatData.seatMap.map((row, rowIndex) => {
            if (isEmptyRow(row)) {
              return (
                <div
                  key={`empty-${rowIndex}`}
                  className={styles.emptyRow}
                ></div>
              );
            }

            return (
              <div key={`row-${row.row}`} className={styles.rowContainer}>
                <div className={styles.seatRow}>
                  {row.activeSeats.map((seat, seatIndex) => (
                    <Seat
                      key={`seat-${row.row}-${seatIndex}`}
                      seatNumber={seat.seat}
                      isReviewed={seat.isReviewed}
                      isSelected={isSeatSelected(row.row, seat.seat)}
                      onClick={() =>
                        seat.seat !== 0 && handleSeatClick(row.row, seat.seat)
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
