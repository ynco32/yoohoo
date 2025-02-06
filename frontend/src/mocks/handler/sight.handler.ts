// handlers/arena.handler.ts
import { rest } from 'msw';
import { mockArenas } from '../data/arena.data';

export const sightHandlers = [
  rest.get('http://localhost:3000/api/v1/view/arenas', (req, res, ctx) => {
    console.log('[MSW] Intercepting request at:', req.url.href);
    return res(
      ctx.status(200),
      ctx.json({
        arenas: mockArenas,
      })
    );
  }),
  // 다른 arena 관련 handler들...
];
