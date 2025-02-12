import { rest } from 'msw';
import { mockConcerts } from '../data/concert.data';

export const concertHandlers = [
  rest.get('/api/v1/concert', (req, res, ctx) => {
    console.log(
      '[MSW] Concert 요청 intercepted:',
      req.url.searchParams.toString()
    );
    console.log('현재 lastConcertId:', req.url.searchParams.get('last'));

    const ITEMS_PER_PAGE = 10;
    const lastParam = req.url.searchParams.get('last');
    const lastConcertId = lastParam !== null ? Number(lastParam) : null;

    const filteredData = [...mockConcerts];

    const startIndex =
      lastConcertId !== null && !isNaN(lastConcertId)
        ? filteredData.findIndex((c) => c.concertId === lastConcertId) + 1
        : 0;

    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

    console.log('응답 데이터:', {
      concerts: paginatedData,
      lastPage: startIndex + ITEMS_PER_PAGE >= filteredData.length,
    });

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json({
        concerts: paginatedData,
        lastPage: startIndex + ITEMS_PER_PAGE >= filteredData.length,
      })
    );
  }),
];
