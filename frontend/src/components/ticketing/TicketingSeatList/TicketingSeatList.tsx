import React, { useEffect } from 'react';
import {
  fetchSeatsByArea,
  selectSeat,
  selectTicketingState,
} from '@/store/slices/ticketingSeatSlice';
import { useDispatch, useSelector } from '@/store/index';
import TicketingSeat from './TicketingSeat';
import styles from './TicketingSeatList.module.scss';
import { TicketingSeatProps } from '@/types/ticketingSeat';

const TicketingSeatList = ({ areaId }: { areaId: string }) => {
  const dispatch = useDispatch();
  const { seats, isLoading, selectedSeatNumber } =
    useSelector(selectTicketingState);

  const SEAT_WIDTH = 20;
  const SEAT_HEIGHT = 20;
  const SEAT_MARGIN = 3;

  // 그리드 생성 로직을 컴포넌트 내부로 통합
  const generateGrid = (
    seats: TicketingSeatProps[],
    seatWidth: number = SEAT_WIDTH,
    seatHeight: number = SEAT_HEIGHT,
    seatMargin: number = SEAT_MARGIN
  ) => {
    // 실제 데이터가 배열인지 확인
    if (!Array.isArray(seats)) {
      console.log('📦 좌석 정보가 없음... ');
      return {
        grid: [],
        dimensions: { width: 0, height: 0 },
      };
    }

    // 행/열 범위 계산 (이미 티켓 타입에 row, col이 포함되어 있음)
    const rows = seats.map((seat) => seat.row);
    const cols = seats.map((seat) => seat.col);
    const minRow = Math.min(...rows);
    const maxRow = Math.max(...rows);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);

    // 그리드 차원 계산
    const gridWidth = (maxCol - minCol + 1) * (seatWidth + seatMargin);
    const gridHeight = (maxRow - minRow + 1) * (seatHeight + seatMargin);

    // 좌석 맵 생성
    const seatMap = new Map<string, TicketingSeatProps>();
    seats.forEach((seat) => {
      seatMap.set(seat.seatNumber, seat);
    });

    // 그리드 생성
    const grid = [];
    for (let row = minRow; row <= maxRow; row++) {
      const gridRow = [];
      for (let col = minCol; col <= maxCol; col++) {
        const seatNumber = `${row}-${col}`;
        const seat = seatMap.get(seatNumber);

        gridRow.push({
          x: (col - minCol) * (seatWidth + seatMargin),
          y: (row - minRow) * (seatHeight + seatMargin),
          seat,
        });
      }
      grid.push(gridRow);
    }

    return {
      grid,
      dimensions: {
        width: gridWidth,
        height: gridHeight,
      },
    };
  };

  // 그리드 생성 함수 호출
  const { grid, dimensions } = generateGrid(seats);

  useEffect(() => {
    dispatch(fetchSeatsByArea(areaId));
  }, [areaId, dispatch]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>좌석 정보를 불러오는 중...</p>
      </div>
    );
  }

  const handleSeatClick = (seatNumber: string) => {
    dispatch(selectSeat(seatNumber));
  };

  return (
    <div className={styles.container}>
      {/* Stage 영역 */}
      <div className={styles.stageContainer}>
        <svg viewBox='0 0 100 30'>
          <rect
            x='0'
            y='0'
            width='100'
            height='30'
            rx='4'
            fill='#1F2937'
            className={styles.stageShadow}
          />
          <text
            x='50'
            y='18'
            textAnchor='middle'
            fill='white'
            className={styles.stageText}
          >
            STAGE
          </text>
        </svg>
      </div>

      {/* 좌석 영역 */}
      <div className={styles.seatsContainer}>
        <svg
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          width={dimensions.width}
          height={dimensions.height}
          className={styles.seatsMap}
        >
          {grid.map((row, rowIndex) =>
            row.map(({ x, y, seat }, colIndex) =>
              seat ? (
                <TicketingSeat
                  key={`${rowIndex}-${colIndex}`}
                  x={x}
                  y={y}
                  width={SEAT_WIDTH}
                  height={SEAT_HEIGHT}
                  number={seat.seatNumber}
                  status={seat.status}
                  isSelected={
                    seat.isSelected || seat.seatNumber === selectedSeatNumber
                  }
                  onClick={() => handleSeatClick(seat.seatNumber)}
                />
              ) : null
            )
          )}
        </svg>
      </div>
    </div>
  );
};

export default TicketingSeatList;
