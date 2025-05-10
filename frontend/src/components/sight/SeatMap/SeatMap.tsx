import React, { useState } from 'react';
import Seat from '@/components/sight/Seat/Seat';
import styles from './SeatMap.module.scss';
import { seatMockData } from '@/mocks/data/seatData';
interface SelectedSeat {
  row: string;
  seat: number;
}

const SeatMap: React.FC = () => {
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

  // 첫 번째 열에 표시할 행 계산
  const firstColumnRows = seatMap.filter((row) => row.row !== '').slice(0, 10);
  // 두 번째 열에 표시할 행 계산
  const secondColumnRows = seatMap.filter((row) => row.row !== '').slice(10);

  return (
    <div className={styles.container}>
      <div className={styles.seatMapContainer}>
        {/* 첫 번째 열 */}
        <div className={styles.column}>
          {firstColumnRows.map((row) => (
            <div key={`row-${row.row}`} className={styles.seatRow}>
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
          ))}
        </div>
        <div className={styles.column}>
          {secondColumnRows.map((row) => (
            <div key={`row-${row.row}`} className={styles.seatRow}>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
