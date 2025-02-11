import { rest } from 'msw';
import { mockApiReviews } from '../data/sightReview.data';

import type {
  ApiResponse,
  ApiReview,
  SightReviewFormData,
  ApiSeatDistance,
  ApiSound,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  StageType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  UserLevel,
} from '@/types/sightReviews';

// MSW Handlers
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

    // 필터링된 리뷰 반환F
    const filteredReviews = mockApiReviews.filter(
      (review) =>
        review.stageType === parseInt(stageType) &&
        (!seatId || review.seatId === parseInt(seatId))
    );

    const response: ApiResponse = {
      reviews: filteredReviews,
    };

    return res(ctx.delay(300), ctx.status(200), ctx.json(response));
  }),

  // POST Review Submission Handler
  rest.post('/api/v1/view/reviews', async (req, res, ctx) => {
    const formData = (await req.json()) as SightReviewFormData;

    // 필수 필드 검증
    if (!formData.content || !formData.viewScore || !formData.section) {
      return res(
        ctx.status(400),
        ctx.json({
          message: '필수 입력 항목이 누락되었습니다.',
        })
      );
    }

    // 폼 데이터를 API 응답 형식으로 변환
    const newReview: ApiReview = {
      reviewId: Math.floor(Math.random() * 1000),
      seatId: formData.columnLine,
      concertId: formData.concertId,
      stageType: formData.stageType,
      content: formData.content,
      userId: 1,
      viewScore: formData.viewScore,
      seatDistance: convertSeatDistance(formData.seatDistance),
      sound: convertSound(formData.sound),
      photoUrl: null, // 실제로는 이미지 업로드 처리가 필요
      writeTime: new Date().toISOString(),
      modifyTime: new Date().toISOString(),
      userNickname: '테스트유저',
      userLevel: 'ROOKIE',
      concertTitle: '테스트 콘서트',
    };

    return res(ctx.delay(500), ctx.status(201), ctx.json(newReview));
  }),

  // GET Single Review Handler
  rest.get('/api/v1/view/reviews/:reviewId', (req, res, ctx) => {
    const { reviewId } = req.params;

    const review = mockApiReviews.find(
      (review) => review.reviewId === parseInt(reviewId as string)
    );

    if (!review) {
      return res(
        ctx.status(404),
        ctx.json({
          message: '리뷰를 찾을 수 없습니다.',
        })
      );
    }

    return res(ctx.delay(300), ctx.status(200), ctx.json(review));
  }),
];

// 에러 케이스 핸들러
export const errorHandlers = [
  rest.get('/api/v1/view/arenas/:arenaId/reviews', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        message: '서버 오류가 발생했습니다.',
      })
    );
  }),

  rest.post('/api/v1/view/reviews', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        message: '리뷰 저장 중 오류가 발생했습니다.',
      })
    );
  }),
  // 에러 케이스 핸들러에 추가
  rest.get('/api/v1/view/reviews/:reviewId', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        message: '리뷰를 불러오는 중 오류가 발생했습니다.',
      })
    );
  }),
];

// Utility functions for type conversion
function convertSeatDistance(distance: string): ApiSeatDistance {
  const mapping: Record<string, ApiSeatDistance> = {
    좁아요: 'NARROW',
    평범해요: 'AVERAGE',
    넓어요: 'WIDE',
  };
  return mapping[distance] || 'AVERAGE';
}

function convertSound(sound: string): ApiSound {
  const mapping: Record<string, ApiSound> = {
    '잘 안 들려요': 'UNCLEAR',
    평범해요: 'AVERAGE',
    선명해요: 'CLEAR',
  };
  return mapping[sound] || 'AVERAGE';
}
