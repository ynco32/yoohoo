// src/mocks/handlers/ticketingHandlers.ts
import { rest } from 'msw';

// 테스트용 좌석 데이터 생성 함수
const generateSeats = (area: number) => {
  const seats = [];
  // area에 따라 다른 좌석 배치 생성
  const rowCount = area === 1 ? 10 : 7; // A구역은 5x5, B구역은 4x4
  const colCount = area === 1 ? 10 : 7;

  for (let row = 1; row <= rowCount; row++) {
    for (let col = 1; col <= colCount; col++) {
      seats.push({
        seatNumber: `${row}-${col}`,
        // area가 1인 경우(A구역)와 2인 경우(B구역)에 따라 다른 확률로 예약 상태 설정
        status:
          Math.random() > (area === 1 ? 0.2 : 0.3) ? 'AVAILABLE' : 'RESERVED',
        userId: Math.random() > (area === 1 ? 0.2 : 0.3) ? null : 1,
      });
    }
  }
  return seats;
};

export const ticketingSeatHandlers = [
  // 좌석 목록 조회
  rest.get('/api/v1/ticketing/sections/seats', (req, res, ctx) => {
    const section = req.url.searchParams.get('section');

    return res(
      ctx.status(200),
      ctx.json({
        seats: generateSeats(Number(section)),
      })
    );
  }),

  // 좌석 예약
  rest.post('/api/v1/ticketing/seats', async (req, res, ctx) => {
    const body = await req.json();

    // 5% 확률로 예약 실패 시뮬레이션
    if (Math.random() < 0.05) {
      return res(
        ctx.status(400),
        ctx.json({
          message: '이미 예약된 좌석입니다.',
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        seatNumber: body.seatNumber,
        status: 'RESERVED',
        userId: body.userId,
      })
    );
  }),
];
