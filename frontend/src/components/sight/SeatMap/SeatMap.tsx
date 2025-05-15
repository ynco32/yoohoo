import React, { useState } from 'react';
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
      <div
        className={styles.seatMapContainer}
        style={{ maxWidth: `${maxWidth}px` }}
      >
        {seatData.seatMap.map((row, rowIndex) => {
          if (isEmptyRow(row)) {
            return (
              <div key={`empty-${rowIndex}`} className={styles.emptyRow}></div>
            );
          }

          return (
            <div key={`row-${row.row}`} className={styles.rowContainer}>
              <div className={styles.rowNumber}>{row.row}</div>
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
  );
};

export default SeatMap;
