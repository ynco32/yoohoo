import { SeatProps } from '@/types/seats';

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

interface UseSeatsGridReturn {
  grid: GridSeat[][];
  dimensions: {
    width: number;
    height: number;
  };
}

export const useSeatsGrid = (
  seats: SeatProps[],
  seatWidth: number = 10,
  seatHeight: number = 10,
  seatMargin: number = 2
): UseSeatsGridReturn => {
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
  const totalWidth = maxSeatsInRow * (seatWidth + seatMargin);
  const totalHeight = ROW_COUNT * (seatHeight + seatMargin);

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
        x: col * (seatWidth + seatMargin),
        y: (row - minRow) * (seatHeight + seatMargin),
        seat,
      });
    }
    grid.push(rowSeats);
  }

  return {
    grid,
    dimensions: {
      width: totalWidth,
      height: totalHeight,
    },
  };
};
