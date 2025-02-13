// mock/handlers/arena.handler.ts

import { rest } from 'msw';
import { mockArenas } from '../data/arena.data';

export const arenaHandlers = [
  rest.get('/api/v1/arena', (req, res, ctx) => {
    console.log('[MSW] Arena 요청 intercepted');

    const response = {
      arenas: mockArenas,
    };

    console.log('응답 데이터:', response);

    return res(ctx.delay(300), ctx.status(200), ctx.json(response));
  }),
];
