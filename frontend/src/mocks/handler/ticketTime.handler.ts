// src/mocks/handlers.ts
import { rest } from 'msw';

export const ticketTimeHandlers = [
  // baseURL이 '/'일 때의 경로와 매칭
  rest.get('/api/v1/ticketing/time-info', (req, res, ctx) => {
    console.log('[MSW] Time info request intercepted');
    return res(
      ctx.status(200),
      ctx.json({
        startTime: '2025-02-11T19:00:00',
        serverTime: '2025-02-11T17:45:44.2540147',
        within10Minutes: false,
        Finished: false,
      })
    );
  }),

  // refresh token handler도 추가
  rest.post('/api/v1/auth/refresh', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        // refresh token 응답 데이터
      })
    );
  }),
];
