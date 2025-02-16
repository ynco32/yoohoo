import { rest } from 'msw';
import type {
  ApiResponse,
  ApiReview,
  SightReviewFormData,
  ApiSeatDistance,
  ApiSound,
  CreateSightReviewRequest,
} from '@/types/sightReviews';

const mockApiReviews: ApiReview[] = [
  {
    reviewId: 1,
    seatId: 101,
    rowLine: 3,
    columnLine: 5,
    concertId: 1001,
    content: '무대가 잘 보이고 음향도 좋았어요!',
    viewScore: 9,
    userId: 2001,
    seatDistance: 'NARROW',
    sound: 'POOR',
    photoUrl:
      'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/conkiri/level4.PNG',
    writeTime: '2025-02-12T10:30:00',
    modifyTime: '2025-02-12T10:30:00',
    stageType: 'DEGREE_360',
    level: '1',
    nickname: '콘서트매니아',
    concertName: '2025 NewJeans Concert',
  },
  {
    reviewId: 2,
    seatId: 102,
    rowLine: 5,
    columnLine: 7,
    concertId: 1001,
    content: '좌석간격이 좁아서 아쉬웠지만 공연은 최고였습니다',
    viewScore: 8,
    userId: 2002,
    seatDistance: 'WIDE',
    sound: 'AVERAGE',
    photoUrl: null,
    writeTime: '2025-02-12T11:15:00',
    modifyTime: '2025-02-12T11:15:00',
    stageType: 'STANDARD',
    level: '2',
    nickname: '음악러버',
    concertName: '2025 NewJeans Concert',
  },
  {
    reviewId: 3,
    seatId: 103,
    rowLine: 2,
    columnLine: 4,
    concertId: 1002,
    content: 'VIP석이라 그런지 정말 가까이서 볼 수 있었어요',
    viewScore: 10,
    userId: 2003,
    seatDistance: 'AVERAGE',
    sound: 'CLEAR',
    photoUrl:
      'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/conkiri/level4.PNGg',
    writeTime: '2025-02-12T12:00:00',
    modifyTime: '2025-02-12T12:00:00',
    stageType: 'THEATER',
    level: '3',
    nickname: null,
    concertName: '2025 IU Concert',
  },
];

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

    console.log('Request params:', {
      stageType,
      section,
      seatId,
      mockDataExists: !!mockApiReviews,
      mockDataLength: mockApiReviews?.length,
    });

    if (!stageType || !section) {
      return res(
        ctx.status(400),
        ctx.json({
          message: '필수 파라미터가 누락되었습니다.',
        })
      );
    }

    // StageType에 따른 필터링
    let filteredReviews = mockApiReviews;

    // seatId가 있는 경우 추가 필터링
    if (seatId) {
      filteredReviews = filteredReviews.filter(
        (review) => review.seatId === parseInt(seatId)
      );
    }

    console.log('Filtered reviews:', filteredReviews);

    const response: ApiResponse = {
      reviews: filteredReviews,
    };

    return res(ctx.delay(300), ctx.status(200), ctx.json(response));
  }),

  // POST Review Submission Handler
  rest.post('/api/v1/view/reviews', async (req, res, ctx) => {
    const formData = req.body as SightReviewFormData;

    console.log('Received form data:', formData);

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
      stageType: 'STANDARD',
      level: 'ROOKIE',
      nickname: '테스트유저',
      concertName: '테스트 콘서트',
    };

    console.log('Created new review:', newReview);

    return res(ctx.delay(500), ctx.status(201), ctx.json(newReview));
  }),

  // PUT Review Update Handler
  rest.put('/api/v1/view/reviews/:reviewId', async (req, res, ctx) => {
    const { reviewId } = req.params;
    const formData = req.body as SightReviewFormData;

    console.log('Update request for review:', reviewId);
    console.log('Update form data:', formData);

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

    console.log('Updated review:', updatedReview);

    return res(ctx.delay(500), ctx.status(200), ctx.json(updatedReview));
  }),

  // DELETE Review Handler
  rest.delete('/api/v1/view/reviews/:reviewId', (req, res, ctx) => {
    const { reviewId } = req.params;

    console.log('Delete request for review:', reviewId);

    const reviewExists = mockApiReviews.some(
      (review) => review.reviewId === parseInt(reviewId as string)
    );

    if (!reviewExists) {
      return res(
        ctx.status(404),
        ctx.json({
          message: '삭제할 리뷰를 찾을 수 없습니다.',
        })
      );
    }

    return res(ctx.delay(300), ctx.status(200), ctx.json({ success: true }));
  }),

  // GET Single Review Handler
  rest.get('/api/v1/view/reviews/:reviewId', (req, res, ctx) => {
    const { reviewId } = req.params;

    console.log('Fetching review:', reviewId);

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
