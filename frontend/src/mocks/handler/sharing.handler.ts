import { rest } from 'msw';
import { getSharingsByConcertId, getSharingById } from '../data/sharing.data';

type PathParams = {
  concertId: string;
  sharingId: string;
};

export const sharingHandlers = [
  rest.get('/api/v1/sharing/:concertId', (req, res, ctx) => {
    const params = req.params as PathParams;
    const concertIdNum = Number(params.concertId);
    const lastParam = req.url.searchParams.get('last');
    const lastSharingId = lastParam !== null ? Number(lastParam) : null;

    const allSharings = getSharingsByConcertId(concertIdNum);
    const ITEMS_PER_PAGE = 10;
    let filteredSharings;

    if (lastSharingId !== null) {
      const lastIndex = allSharings.findIndex(
        (sharing) => sharing.sharingId === lastSharingId
      );
      filteredSharings = allSharings.slice(
        lastIndex + 1,
        lastIndex + 1 + ITEMS_PER_PAGE
      );
    } else {
      filteredSharings = allSharings.slice(0, ITEMS_PER_PAGE);
    }

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json({
        sharings: filteredSharings,
        isLastPage:
          filteredSharings.length === 0 ||
          filteredSharings[filteredSharings.length - 1].sharingId ===
            allSharings[allSharings.length - 1].sharingId,
      })
    );
  }),

  // 나눔 게시글 상세 조회
  rest.get('/api/v1/sharing/detail/:sharingId', (req, res, ctx) => {
    const params = req.params as PathParams;
    const sharingIdNum = Number(params.sharingId);
    const sharing = getSharingById(sharingIdNum);

    if (!sharing) {
      return res(
        ctx.delay(300),
        ctx.status(404),
        ctx.json({ message: '게시글을 찾을 수 없습니다.' })
      );
    }

    return res(ctx.delay(300), ctx.status(200), ctx.json(sharing));
  }),
];
