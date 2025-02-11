import { rest } from 'msw';
import { mockConcerts } from '../data/concertSight.data';

export const concertSightHandlers = [
  rest.get('/api/v1/view/concerts', (req, res, ctx) => {
    console.log(
      '[MSW] Concert View 요청 intercepted:',
      req.url.searchParams.toString()
    );

    const artistParam = req.url.searchParams.get('artist');
    console.log('검색된 아티스트:', artistParam);

    let filteredConcerts = [...mockConcerts];

    // 아티스트 이름으로 필터링
    if (artistParam) {
      filteredConcerts = filteredConcerts.filter((concert) =>
        concert.artist.toLowerCase().includes(artistParam.toLowerCase())
      );
    }

    console.log('응답 데이터:', {
      concerts: filteredConcerts,
    });

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json({
        concerts: filteredConcerts,
      })
    );
  }),
];
