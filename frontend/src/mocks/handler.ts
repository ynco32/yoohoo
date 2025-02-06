import { rest } from 'msw';

const mockArenas = [
  {
    arenaId: 1,
    arenaName: '올림픽체조경기장',
    photoUrl: '/images/kspo.png',
  },
  {
    arenaId: 2,
    arenaName: '고척스카이돔',
    photoUrl: '/images/kspo.png',
  },
];

export const handlers = [
  // 모든 가능한 경로 패턴에 대해 처리
  rest.get('http://localhost:3000/api/v1/view/arenas', (req, res, ctx) => {
    console.log('[MSW] Intercepting request at:', req.url.href);
    return res(
      ctx.status(200),
      ctx.json({
        arenas: mockArenas,
      })
    );
  }),
];
