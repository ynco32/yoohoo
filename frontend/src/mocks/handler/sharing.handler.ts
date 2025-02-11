import { rest } from 'msw';
import {
  getSharingsByConcertId,
  getSharingById,
  getCommentsByPage,
  addSharing,
  getScrappedSharings,
} from '../data/sharing.data';

type PathParams = {
  concertId: string;
  sharingId: string;
};

export const sharingHandlers = [
  // 글 작성 API
  rest.post('/api/v1/sharing', async (req, res, ctx) => {
    try {
      const data = await req.text();
      const boundary = req.headers.get('content-type')?.split('boundary=')[1];

      if (!boundary) {
        return res(
          ctx.status(400),
          ctx.json({ message: 'Invalid content type' })
        );
      }

      // FormData 파트 분리
      const parts = data.split('--' + boundary);
      let requestBody = null;
      let hasFile = false;

      for (const part of parts) {
        if (part.includes('name="sharingRequestDTO"')) {
          const jsonStr = part.split('\r\n\r\n')[1]?.split('\r\n')[0];
          if (jsonStr) {
            requestBody = JSON.parse(jsonStr);
          }
        }
        if (part.includes('name="file"')) {
          hasFile = true;
        }
      }

      if (!requestBody || !hasFile) {
        return res(
          ctx.status(400),
          ctx.json({ message: '필수 필드가 누락되었습니다.' })
        );
      }

      // 필수 필드 검증
      if (
        !requestBody.title ||
        !requestBody.content ||
        typeof requestBody.latitude !== 'number' ||
        typeof requestBody.longitude !== 'number' ||
        !requestBody.startTime ||
        typeof requestBody.concertId !== 'number'
      ) {
        return res(
          ctx.status(400),
          ctx.json({ message: '필수 필드가 누락되었습니다.' })
        );
      }

      // 새로운 나눔 게시글 추가
      const newSharing = addSharing({
        ...requestBody,
        status: 'UPCOMING',
        nickname: '닉네임',
        photoUrl: '/images/card.png',
      });

      return res(
        ctx.status(201),
        ctx.json({
          message: '나눔 글 등록 성공',
          sharingId: newSharing.sharingId,
        })
      );
    } catch (error) {
      console.error('❌ [MSW] 핸들러 내부 오류:', error);
      return res(ctx.status(500), ctx.json({ message: '서버 내부 오류' }));
    }
  }),

  // 나눔 글 전체 목록
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

  // 스크랩 추가
  rest.post('/api/v1/sharing/:sharingId/scrap', (req, res, ctx) => {
    return res(
      ctx.delay(300),
      ctx.status(201),
      ctx.json({
        message: '스크랩 성공',
        isScraped: true,
      })
    );
  }),

  // 스크랩 취소
  rest.delete('/api/v1/sharing/:sharingId/scrap', (req, res, ctx) => {
    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json({
        message: '스크랩 취소 성공',
        isScraped: false,
      })
    );
  }),

  // 스크랩한 게시글 목록 조회
  rest.get('/api/v1/mypage/scrap', (req, res, ctx) => {
    const lastParam = req.url.searchParams.get('last');
    const lastSharingId = lastParam !== null ? Number(lastParam) : undefined;

    const result = getScrappedSharings(lastSharingId);

    return res(ctx.delay(300), ctx.status(200), ctx.json(result));
  }),
];
