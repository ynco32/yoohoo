import { rest } from 'msw';
import { mockApiReviews } from '../data/sightReview.data';
import { StageType } from '@/types/sightReviews';
import type {
  ApiResponse,
  ApiReview,
  SightReviewFormData,
  ApiSeatDistance,
  ApiSound,
  CreateSightReviewRequest, // 추가
} from '@/types/sightReviews';

// API 요청 형식으로 변환하는 함수
const mapFormDataToApiRequest = (
  formData: SightReviewFormData
): CreateSightReviewRequest => {
  const seatDistanceMap: Record<string, ApiSeatDistance> = {
    좁아요: 'NARROW',
    평범해요: 'AVERAGE',
    넓어요: 'WIDE',
  };

  const soundMap: Record<string, ApiSound> = {
    '잘 안 들려요': 'POOR',
    평범해요: 'AVERAGE',
    선명해요: 'CLEAR',
  };

  return {
    concertId: formData.concertId,
    sectionNumber: formData.sectionNumber,
    rowLine: formData.rowLine,
    columnLine: formData.columnLine,
    content: formData.content,
    viewScore: formData.viewScore,
    seatDistance: seatDistanceMap[formData.seatDistance],
    sound: soundMap[formData.sound],
  };
};

export const sightReviewHandlers = [
  // GET Arena Reviews Handler
  rest.get('/api/v1/view/arenas/:arenaId/reviews', (req, res, ctx) => {
    const stageType = req.url.searchParams.get('stageType');
    const section = req.url.searchParams.get('section');
    const seatId = req.url.searchParams.get('seatId');

    if (!stageType || !section) {
      return res(
        ctx.status(400),
        ctx.json({
          message: '필수 파라미터가 누락되었습니다.',
        })
      );
    }

    const stageTypeEnum = StageType[Number(stageType)];

    const filteredReviews = mockApiReviews.filter(
      (review) =>
        review.stageType === stageTypeEnum &&
        (!seatId || review.seatId === parseInt(seatId))
    );

    const response: ApiResponse = {
      reviews: filteredReviews,
    };

    return res(ctx.delay(300), ctx.status(200), ctx.json(response));
  }),

  // POST Review Submission Handler
  rest.post('/api/v1/view/reviews', async (req, res, ctx) => {
    const formData = req.body as SightReviewFormData;

    if (!formData.content || !formData.viewScore || !formData.sectionNumber) {
      return res(
        ctx.status(400),
        ctx.json({
          message: '필수 입력 항목이 누락되었습니다.',
        })
      );
    }

    // 폼 데이터를 API 요청 형식으로 변환
    const apiRequest = mapFormDataToApiRequest(formData);

    const newReview: ApiReview = {
      reviewId: Math.floor(Math.random() * 1000),
      seatId: formData.columnLine,
      rowLine: apiRequest.rowLine,
      columnLine: apiRequest.columnLine,
      concertId: apiRequest.concertId,
      content: apiRequest.content,
      viewScore: apiRequest.viewScore,
      userId: 1,
      seatDistance: apiRequest.seatDistance,
      sound: apiRequest.sound,
      photoUrl: null,
      writeTime: new Date().toISOString(),
      modifyTime: new Date().toISOString(),
      stageType: StageType.STANDARD.toString(),
      level: 'ROOKIE',
      nickname: '테스트유저',
      concertName: '테스트 콘서트',
    };

    return res(ctx.delay(500), ctx.status(201), ctx.json(newReview));
  }),

  // PUT Review Update Handler
  rest.put('/api/v1/view/reviews/:reviewId', async (req, res, ctx) => {
    const { reviewId } = req.params;
    const formData = req.body as SightReviewFormData;

    if (!formData.content || !formData.viewScore || !formData.sectionNumber) {
      return res(
        ctx.status(400),
        ctx.json({
          message: '필수 입력 항목이 누락되었습니다.',
        })
      );
    }

    const existingReview = mockApiReviews.find(
      (review) => review.reviewId === parseInt(reviewId as string)
    );

    if (!existingReview) {
      return res(
        ctx.status(404),
        ctx.json({
          message: '수정할 리뷰를 찾을 수 없습니다.',
        })
      );
    }

    // 폼 데이터를 API 요청 형식으로 변환
    const apiRequest = mapFormDataToApiRequest(formData);

    const updatedReview: ApiReview = {
      ...existingReview,
      content: apiRequest.content,
      viewScore: apiRequest.viewScore,
      seatDistance: apiRequest.seatDistance,
      sound: apiRequest.sound,
      modifyTime: new Date().toISOString(),
    };

    return res(ctx.delay(500), ctx.status(200), ctx.json(updatedReview));
  }),
];
