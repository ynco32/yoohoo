import { rest } from 'msw';
import { mockApiReviews } from '../data/sightReview.data';

import type {
  ApiResponse,
  ApiReview,
  SightReviewFormData,
  ApiSeatDistance,
  ApiSound,
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

    // 필터링된 리뷰 반환
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
    const formData = req.body as SightReviewFormData;

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
      photoUrl: null,
      writeTime: new Date().toISOString(),
      modifyTime: new Date().toISOString(),
      userNickname: '테스트유저',
      userLevel: 'ROOKIE',
      concertTitle: '테스트 콘서트',
    };

    return res(ctx.delay(500), ctx.status(201), ctx.json(newReview));
  }),

  // PUT Review Update Handler
  rest.put('/api/v1/view/reviews/:reviewId', async (req, res, ctx) => {
    const { reviewId } = req.params;
    const formData = req.body as SightReviewFormData;

    // 필수 필드 검증
    if (!formData.content || !formData.viewScore || !formData.section) {
      return res(
        ctx.status(400),
        ctx.json({
          message: '필수 입력 항목이 누락되었습니다.',
        })
      );
    }

    // 기존 리뷰 찾기
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

    // 업데이트된 리뷰 데이터 생성
    const updatedReview: ApiReview = {
      ...existingReview,
      content: formData.content,
      viewScore: formData.viewScore,
      seatDistance: convertSeatDistance(formData.seatDistance),
      sound: convertSound(formData.sound),
      modifyTime: new Date().toISOString(),
    };

    return res(ctx.delay(500), ctx.status(200), ctx.json(updatedReview));
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

  // DELETE Review Handler
  rest.delete('/api/v1/view/reviews/:reviewId', (req, res, ctx) => {
    const { reviewId } = req.params;

    const reviewIndex = mockApiReviews.findIndex(
      (review) => review.reviewId === parseInt(reviewId as string)
    );

    if (reviewIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          message: '삭제할 리뷰를 찾을 수 없습니다.',
        })
      );
    }

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json({
        message: '리뷰가 성공적으로 삭제되었습니다.',
      })
    );
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

  rest.put('/api/v1/view/reviews/:reviewId', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        message: '리뷰 수정 중 오류가 발생했습니다.',
      })
    );
  }),

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
