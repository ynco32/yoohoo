import React, { useState } from 'react';
import Seat from '@/components/sight/Seat/Seat';
import styles from './SeatMap.module.scss';
import { seatMockData } from '@/mocks/data/seatData';

interface SelectedSeat {
  row: string;
  seat: number;
}

interface SeatMapProps {
  arenaId: string;
  sectionId: string;
}

const SeatMap: React.FC<SeatMapProps> = ({ arenaId, sectionId }) => {
  const { section, seatMap } = seatMockData;
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  // 좌석 선택 처리 함수
  const handleSeatClick = (row: string, seatNumber: number) => {
    // 이미 선택된 좌석인지 확인
    const isAlreadySelected = selectedSeats.some(
      (selected) => selected.row === row && selected.seat === seatNumber
    );

    if (isAlreadySelected) {
      // 이미 선택된 좌석이면 선택 해제
      setSelectedSeats(
        selectedSeats.filter(
          (selected) => !(selected.row === row && selected.seat === seatNumber)
        )
      );
    } else {
      // 새로운 좌석 선택
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

  return (
    <div className={styles.container}>
      <div className={styles.seatMapContainer}>
        {seatMap.map((row, rowIndex) => {
          if (isEmptyRow(row)) {
            // 빈 행인 경우 공백으로 처리
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
