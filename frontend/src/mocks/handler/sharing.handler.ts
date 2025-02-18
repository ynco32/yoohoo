import { rest } from 'msw';
import {
  getSharingsByConcertId,
  getSharingById,
  // addSharing,
  getScrappedSharings,
  getWroteSharings,
  // ExtendedSharingPost,
  mockScrappedSharingIds,
} from '../data/sharing.data';
// import { SharingStatus } from '@/types/sharing';

type PathParams = {
  concertId: string;
  sharingId: string;
};
// interface SharingRequestBody {
//   sharingRequestDTO: string;
//   file: File;
// }

interface SharingUpdateRequestBody {
  sharingUpdateRequestDTO: string;
  file?: File;
}

let mockSharingId = 100; // 초기 ID 값 설정

export const sharingHandlers = [
  // 글 작성 API
  rest.post('/api/v1/sharing', async (req, res, ctx) => {
    try {
      console.log('📩 [MSW] 나눔 게시글 등록 테스트 요청 도착');

      // 임의의 `sharingId` 반환 (실제 API와 동일한 숫자 형태로 응답)
      const newSharingId = mockSharingId++;

      console.log('✅ [MSW] 생성된 sharingId:', newSharingId);

      return res(ctx.status(201), ctx.json(newSharingId));
    } catch (error) {
      console.error('❌ [MSW] createSharing 핸들러 오류:', error);
      return res(ctx.status(500), ctx.json({ message: '서버 내부 오류' }));
    }
  }),

  // 나눔 게시글 수정
  rest.put('/api/v1/sharing/:sharingId', async (req, res, ctx) => {
    try {
      const { sharingId } = req.params;

      const body = req.body as SharingUpdateRequestBody;

      const sharingUpdateRequestDTOString = body.sharingUpdateRequestDTO;
      const file = body.file;

      console.log('Update request:', {
        sharingId,
        sharingUpdateRequestDTO: sharingUpdateRequestDTOString,
        file: file
          ? {
              name: file.name,
              size: file.size,
              type: file.type,
            }
          : undefined,
      });

      // JSON 문자열을 파싱하고 사용
      const sharingUpdateRequestDTO = JSON.parse(sharingUpdateRequestDTOString);

      let updatedPhotoUrl = '/images/original_image.png';
      if (file) {
        updatedPhotoUrl = '/images/new_uploaded_image.png';
      }

      return res(
        ctx.status(200),
        ctx.json({
          message: '나눔 글 수정 성공',
          sharingId: Number(sharingId),
          photoUrl: updatedPhotoUrl,
          // 파싱된 데이터 중 일부 활용 예시
          title: sharingUpdateRequestDTO.title,
        })
      );
    } catch (error) {
      console.error('❌ [MSW] updateSharing 핸들러 오류:', error);
      return res(ctx.status(500), ctx.json({ message: '서버 내부 오류' }));
    }
  }),

  // 게시글 상태 변경
  rest.patch('/api/v1/sharing/:sharingId/status', async (req, res, ctx) => {
    try {
      const { sharingId } = req.params;
      const { status } = await req.json();

      // status 타입 확인 (UPCOMING, ONGOING, CLOSED)
      if (!['UPCOMING', 'ONGOING', 'CLOSED'].includes(status)) {
        return res(
          ctx.status(400),
          ctx.json({ message: '유효하지 않은 상태값입니다.' })
        );
      }

      console.log('[MSW] 상태 변경:', { sharingId, status });

      // 성공 응답
      return res(
        ctx.status(200),
        ctx.json({
          message: '상태가 성공적으로 변경되었습니다.',
          sharingId: Number(sharingId),
          status,
        })
      );
    } catch (error) {
      console.error('[MSW] 상태 변경 처리 중 오류:', error);
      return res(
        ctx.status(500),
        ctx.json({ message: '서버 내부 오류가 발생했습니다.' })
      );
    }
  }),

  // 게시글 삭제 핸들러
  rest.delete('/api/v1/sharing/:sharingId', async (req, res, ctx) => {
    try {
      const { sharingId } = req.params;
      console.log('[MSW] 게시글 삭제 요청:', sharingId);
      return res(
        ctx.delay(300),
        ctx.status(200),
        ctx.json({
          message: '게시글이 성공적으로 삭제되었습니다.',
          sharingId: Number(sharingId),
        })
      );
    } catch (error) {
      console.error('[MSW] 게시글 삭제 처리 중 오류:', error);
      return res(
        ctx.status(500),
        ctx.json({ message: '서버 내부 오류가 발생했습니다.' })
      );
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

    // 스크랩 상태 추가
    const isScraped = mockScrappedSharingIds.has(sharingIdNum);

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json({
        ...sharing,
        isScraped, // 스크랩 상태 포함
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
  rest.get('/api/v1/sharing/scrap/:concertId', (req, res, ctx) => {
    const params = req.params as PathParams;
    const concertIdNum = Number(params.concertId);
    const lastParam = req.url.searchParams.get('last');
    const lastSharingId = lastParam !== null ? Number(lastParam) : undefined;

    const result = getScrappedSharings(concertIdNum, lastSharingId);

    return res(ctx.delay(300), ctx.status(200), ctx.json(result));
  }),

  // 내가 작성한 글 목록 조회
  rest.get('/api/v1/sharing/wrote/:concertId', (req, res, ctx) => {
    const params = req.params as PathParams;
    const concertIdNum = Number(params.concertId);
    const lastParam = req.url.searchParams.get('last');
    const lastSharingId = lastParam !== null ? Number(lastParam) : undefined;

    const result = getWroteSharings(concertIdNum, lastSharingId);

    return res(ctx.delay(300), ctx.status(200), ctx.json(result));
  }),

  // 내 작성글 목록 조회 (마이페이지)
  rest.get('/api/v1/mypage/wrote', (req, res, ctx) => {
    console.log('[MSW] 마이페이지 작성글 목록 요청 받음');
    const lastParam = req.url.searchParams.get('last');
    const lastSharingId = lastParam !== null ? Number(lastParam) : undefined;

    // 모든 콘서트에 대한 내 작성글을 가져오기 위해 concertId를 0으로 전달
    const result = getWroteSharings(0, lastSharingId);

    console.log('[MSW] 마이페이지 작성글 목록 응답:', {
      lastSharingId,
      result,
    });

    return res(ctx.delay(300), ctx.status(200), ctx.json(result));
  }),

  // 내 스크랩 목록 조회 (마이페이지)
  rest.get('/api/v1/mypage/scrap', (req, res, ctx) => {
    console.log('[MSW] 마이페이지 스크랩 목록 요청 받음');
    const lastParam = req.url.searchParams.get('last');
    const lastSharingId = lastParam !== null ? Number(lastParam) : undefined;

    // 모든 콘서트에 대한 내 스크랩을 가져오기 위해 concertId를 0으로 전달
    const result = getScrappedSharings(0, lastSharingId);

    console.log('[MSW] 마이페이지 스크랩 목록 응답:', {
      lastSharingId,
      result,
    });

    return res(ctx.delay(300), ctx.status(200), ctx.json(result));
  }),
];
