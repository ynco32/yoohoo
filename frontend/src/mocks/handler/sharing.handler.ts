import { rest } from 'msw';
import {
  getSharingsByConcertId,
  getSharingById,
  getCommentsByPage,
} from '../data/sharing.data';

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

    // 현재 요청에서 가져온 데이터 이후의 남은 데이터 길이 계산
    const nextStartIndex =
      lastSharingId !== null
        ? allSharings.findIndex(
            (sharing) => sharing.sharingId === lastSharingId
          ) + filteredSharings.length
        : filteredSharings.length;

    const remainingItems = allSharings.length - nextStartIndex;

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json({
        sharings: filteredSharings,
        lastPage: remainingItems <= 0,
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

  // 댓글 목록 조회
  rest.get('/api/v1/sharing/:sharingId/comment', (req, res, ctx) => {
    const params = req.params as PathParams;
    const sharingIdNum = Number(params.sharingId);
    const lastParam = req.url.searchParams.get('last');
    const lastCommentId = lastParam !== null ? Number(lastParam) : undefined;

    // 게시글이 존재하는지 먼저 확인
    const sharing = getSharingById(sharingIdNum);
    if (!sharing) {
      return res(
        ctx.delay(300),
        ctx.status(400),
        ctx.json({ message: '게시글을 찾을 수 없습니다.' })
      );
    }

    // 댓글 페이지네이션 처리
    const { comments, lastPage } = getCommentsByPage(lastCommentId);

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json({
        comments,
        lastPage,
      })
    );
  }),
];
