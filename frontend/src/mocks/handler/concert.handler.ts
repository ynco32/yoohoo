import { rest } from 'msw';
import { mockConcerts } from '../data/concert.data';

export const concertHandlers = [
  rest.get('/api/v1/concert', (req, res, ctx) => {
    console.log(
      '[MSW] Concert 요청 intercepted:',
      req.url.searchParams.toString()
    );

    const searchValue = req.url.searchParams.get('value');
    const lastParam = req.url.searchParams.get('last');
    const lastConcertId = lastParam !== null ? Number(lastParam) : null;
    const ITEMS_PER_PAGE = 10;

    console.log('검색어:', searchValue);
    console.log('현재 lastConcertId:', lastConcertId);

    // 검색어로 필터링
    let filteredData = [...mockConcerts];
    if (searchValue) {
      filteredData = mockConcerts.filter((concert) =>
        concert.concertName.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // 페이지네이션 적용
    const startIndex =
      lastConcertId !== null && !isNaN(lastConcertId)
        ? filteredData.findIndex((c) => c.concertId === lastConcertId) + 1
        : 0;

    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

    const response = {
      concerts: paginatedData,
      lastPage: startIndex + ITEMS_PER_PAGE >= filteredData.length,
    };

    console.log('응답 데이터:', response);

    return res(ctx.delay(300), ctx.status(200), ctx.json(response));
  }),
];
