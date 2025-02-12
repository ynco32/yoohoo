import { rest } from 'msw';
import {
  getSharingsByConcertId,
  getSharingById,
  addSharing,
  getScrappedSharings,
  getWroteSharings,
  ExtendedSharingPost,
} from '../data/sharing.data';
import { SharingStatus } from '@/types/sharing';

type PathParams = {
  concertId: string;
  sharingId: string;
};

export const sharingHandlers = [
  // 글 작성 API
  rest.post('/api/v1/sharing', async (req, res, ctx) => {
    try {
      const body = req.body as { sharingRequestDTO: File; file: File };
      console.log('Request received:', {
        sharingRequestDTO: {
          name: body.sharingRequestDTO?.name,
          size: body.sharingRequestDTO?.size,
          type: body.sharingRequestDTO?.type,
        },
        file: {
          name: body.file?.name,
          size: body.file?.size,
          type: body.file?.type,
        },
      });

      // 임시 mock 데이터 생성 - 실제 환경에서는 요청 데이터를 사용해야 합니다
      const mockSharingData: Omit<ExtendedSharingPost, 'sharingId'> = {
        concertId: 1,
        title: '테스트 게시글',
        content: '테스트 내용입니다.',
        latitude: 37.5665,
        longitude: 126.978,
        startTime: new Date().toISOString(),
        status: 'UPCOMING' as SharingStatus,
        nickname: '닉네임',
        writerId: 100,
        photoUrl: '/images/card.png',
      };

      // 새로운 나눔 게시글 추가
      const newSharing = addSharing(mockSharingData);
      console.log('Created new sharing:', newSharing);

      return res(
        ctx.status(201),
        ctx.json({
          sharingId: newSharing.sharingId,
        })
      );
    } catch (error) {
      console.error('❌ [MSW] createSharing 핸들러 오류:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }
      return res(ctx.status(500), ctx.json({ message: '서버 내부 오류' }));
    }
  }),

  // 나눔 게시글 수정
  rest.put('/api/v1/sharing/:sharingId', async (req, res, ctx) => {
    try {
      const { sharingId } = req.params;
      const body = req.body as { sharingUpdateRequestDTO: File; file?: File };

      console.log('Update request:', {
        sharingId,
        sharingUpdateRequestDTO: {
          name: body.sharingUpdateRequestDTO?.name,
          size: body.sharingUpdateRequestDTO?.size,
          type: body.sharingUpdateRequestDTO?.type,
        },
        file: body.file
          ? {
              name: body.file.name,
              size: body.file.size,
              type: body.file.type,
            }
          : undefined,
      });

      let updatedPhotoUrl = '/images/original_image.png';
      if (body.file) {
        updatedPhotoUrl = '/images/new_uploaded_image.png';
      }

      return res(
        ctx.status(200),
        ctx.json({
          message: '나눔 글 수정 성공',
          sharingId: Number(sharingId),
          photoUrl: updatedPhotoUrl,
        })
      );
    } catch (error) {
      console.error('❌ [MSW] updateSharing 핸들러 오류:', error);
      return res(ctx.status(500), ctx.json({ message: '서버 내부 오류' }));
    }
  }),

  // 게시글 상태 변경
  rest.put('/api/v1/sharing/:sharingId/status', async (req, res, ctx) => {
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

    return res(ctx.delay(300), ctx.status(200), ctx.json(sharing));
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
];
