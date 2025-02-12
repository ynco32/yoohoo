import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Seat from '@/components/ui/Seat';
import { useSeatsStore } from '@/store/useSeatStore';
import { SeatProps } from '@/types/seats';

interface SeatListProps {
  isScrapMode: boolean;
}

interface RowInfo {
  count: number;
  minCol: number;
  maxCol: number;
}

interface SeatsByRow {
  [key: number]: SeatProps[];
}

interface GridSeat {
  x: number;
  y: number;
  seat: SeatProps | undefined;
}

const SeatList = ({ isScrapMode }: SeatListProps) => {
  const { seats, isLoading, fetchSeatsBySection } = useSeatsStore();
  const { arenaId, stageType, sectionId } = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchSeatsBySection(Number(arenaId), Number(stageType), Number(sectionId));
  }, [arenaId, stageType, sectionId, fetchSeatsBySection]);

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  const SEAT_WIDTH = 10;
  const SEAT_HEIGHT = 10;
  const SEAT_MARGIN = 2;

  // 행별로 좌석 그룹화
  const seatsByRow = seats.reduce<SeatsByRow>((acc, seat: SeatProps) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  // 행 번호 배열 생성
  const rowNumbers = Object.keys(seatsByRow).map(Number);

  // 실제 차원 계산
  const minRow = Math.min(...rowNumbers);
  const maxRow = Math.max(...rowNumbers);
  const ROW_COUNT = maxRow - minRow + 1;

  // 행당 최대 좌석 수 찾기
  const maxSeatsInRow = Math.max(
    ...Object.values(seatsByRow).map((rowSeats) => rowSeats.length)
  );

  // 전체 너비와 높이 계산
  const totalWidth = maxSeatsInRow * (SEAT_WIDTH + SEAT_MARGIN);
  const totalHeight = ROW_COUNT * (SEAT_HEIGHT + SEAT_MARGIN);

  // 위치별 좌석 매핑
  const seatMap = new Map<string, SeatProps>();
  seats.forEach((seat: SeatProps) => {
    const key = `${seat.row}-${seat.col}`;
    seatMap.set(key, seat);
  });

  // 행별 좌석 수 계산
  const seatsPerRow = new Map<number, RowInfo>();
  Object.entries(seatsByRow).forEach(([row, rowSeats]) => {
    const cols = rowSeats.map((seat: SeatProps) => seat.col);
    seatsPerRow.set(Number(row), {
      count: rowSeats.length,
      minCol: Math.min(...cols),
      maxCol: Math.max(...cols),
    });
  });

  // 그리드 레이아웃 생성
  const grid: GridSeat[][] = [];
  for (let row = minRow; row <= maxRow; row++) {
    const rowSeats: GridSeat[] = [];
    const rowInfo = seatsPerRow.get(row) || { count: 0, minCol: 0, maxCol: 0 };
    const seatsInThisRow = rowInfo.count;

    // 중앙 정렬을 위한 오프셋 계산
    const startCol = Math.floor((maxSeatsInRow - seatsInThisRow) / 2);

    for (let col = 0; col < maxSeatsInRow; col++) {
      const adjustedCol = col - startCol;
      const seat = seatMap.get(`${row}-${adjustedCol}`);
      rowSeats.push({
        x: col * (SEAT_WIDTH + SEAT_MARGIN),
        y: (row - minRow) * (SEAT_HEIGHT + SEAT_MARGIN),
        seat,
      });
    }
    grid.push(rowSeats);
  }

  return (
    <div className="flex w-full justify-center">
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        width={totalWidth}
        height={totalHeight}
        className="max-w-full"
      >
        {grid.map((row, rowIndex) =>
          row.map(({ x, y, seat }, seatIndex) =>
            seat ? (
              <Seat
                key={`${rowIndex}-${seatIndex}`}
                {...seat}
                scrapped={seat.scrapped}
                isScrapMode={isScrapMode}
                x={x}
                y={y}
                width={SEAT_WIDTH}
                height={SEAT_HEIGHT}
                onClick={() =>
                  router.push(
                    `/sight/${seat.arenaId}/${stageType}/${seat.sectionId}/${seat.seatId}`
                  )
                }
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};

export default SeatList;
