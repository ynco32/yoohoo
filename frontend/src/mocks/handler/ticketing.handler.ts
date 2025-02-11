// [MSW] 티켓팅 관련 API 핸들러
import { rest } from 'msw';

export const ticketingHandlers = [
  rest.post('/api/v1/ticketing/queue', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(3) // 큐 번호 3을 반환
    );
  }),
];
