import { rest } from 'msw';
import {
  getSharingsByConcertId,
  getSharingById,
  getCommentsBySharingId,
} from '../data/sharing.data';

type PathParams = {
  concertId: string;
  sharingId: string;
};

export const sharingHandlers = [
  // 나눔 게시글 목록 조회 (전체 or 페이지네이션)
  rest.get('/api/v1/sharing/:concertId', (req, res, ctx) => {
    const params = req.params as PathParams;
    const concertIdNum = Number(params.concertId);
    const shouldPaginate = req.url.searchParams.get('paginate') === 'true';
    const lastParam = req.url.searchParams.get('last');
    const lastSharingId = lastParam !== null ? Number(lastParam) : null;

    const allSharings = getSharingsByConcertId(concertIdNum);

    // 페이지네이션을 사용하지 않는 경우 (지도 뷰)
    if (!shouldPaginate) {
      return res(
        ctx.delay(300),
        ctx.status(200),
        ctx.json({
          sharings: allSharings,
          isLastPage: true,
        })
      );
    }

    // 페이지네이션을 사용하는 경우 (리스트 뷰)
    const ITEMS_PER_PAGE = 5;
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

  // 나머지 핸들러들은 그대로 유지...
];
