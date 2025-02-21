// mock/handlers/seats.handlers.ts

import { rest } from 'msw';
import { mockSeats } from '../data/seats.data';

export const seatsHandlers = [
  rest.get('/api/v1/view/arenas/:arenaId', (req, res, ctx) => {
    console.log('[MSW] Seats 요청 intercepted:', req.url.toString());

    const { arenaId } = req.params;
    const stageType = req.url.searchParams.get('stageType');
    const section = req.url.searchParams.get('section');

    console.log('요청 파라미터:', {
      arenaId,
      stageType,
      section,
    });

    // section 파라미터에 따라 좌석 필터링
    const filteredSeats = mockSeats.filter(
      (seat) => seat.sectionNumber === Number(section)
    );

    console.log('응답 데이터:', {
      seats: filteredSeats,
    });

    // 요청에 대한 응답 시뮬레이션
    if (!arenaId || !stageType || !section) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'Missing required parameters',
        })
      );
    }

    return res(
      ctx.delay(300), // 네트워크 지연 시뮬레이션
      ctx.status(200),
      ctx.json({
        seats: filteredSeats,
      })
    );
  }),
];
