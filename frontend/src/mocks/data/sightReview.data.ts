// src/mocks/data/sightReview.data.ts

import type {
  ApiReview,
  ApiResponse,
  SightReviewFormData,
  ApiSeatDistance,
  ApiSound,
  StageType,
  SeatDistanceStatus,
  SoundStatus,
} from '@/types/sightReviews';

// Mock Data
export const mockApiReviews: ApiReview[] = [
  {
    reviewId: 1,
    seatId: 1,
    concertId: 1,
    userId: 1,
    content: '무대가 잘 보이고 음향도 좋았습니다.',
    viewScore: 4.5,
    seatDistance: 'AVERAGE',
    sound: 'CLEAR',
    photoUrl: '/images/sight.png',
    writeTime: '2025-02-10T10:00:00',
    modifyTime: '2025-02-10T10:00:00',
    stageType: 1,
    userNickname: '관람자1',
    userLevel: '1',
    concertTitle: '2025 첫 번째 콘서트',
  },
  {
    reviewId: 2,
    seatId: 1,
    concertId: 1,
    userId: 2,
    content: '최고의 자리였습니다! 아티스트의 표정까지 선명하게 보였어요.',
    viewScore: 5,
    seatDistance: 'NARROW',
    sound: 'CLEAR',
    photoUrl: '/images/sight.png',
    writeTime: '2025-02-09T15:30:00',
    modifyTime: '2025-02-09T15:30:00',
    stageType: 1,
    userNickname: '관람자2',
    userLevel: '2',
    concertTitle: '2025 첫 번째 콘서트',
  },
  {
    reviewId: 3,
    seatId: 103,
    concertId: 1,
    userId: 1,
    content: '옆 시야는 좀 가렸지만 전반적으로 괜찮았습니다.',
    viewScore: 3.5,
    seatDistance: 'WIDE',
    sound: 'AVERAGE',
    photoUrl: null,
    writeTime: '2025-02-08T20:15:00',
    modifyTime: '2025-02-08T20:15:00',
    stageType: 2,
    userNickname: '관람자3',
    userLevel: '1',
    concertTitle: '2025 첫 번째 콘서트',
  },
];

// 리뷰 필터링 헬퍼 함수
export const getFilteredReviews = (
  arenaId: number,
  stageType: StageType,
  sectionId: number,
  seatId?: number
): ApiResponse => {
  const reviews = mockApiReviews.filter((review) => {
    const baseMatch = review.stageType === stageType;

    if (seatId) {
      return baseMatch && review.seatId === seatId;
    }

    return baseMatch;
  });

  return { reviews };
};

// 새 리뷰 생성 헬퍼 함수
export const createSightReview = (data: SightReviewFormData): ApiReview => {
  // FormData의 SeatDistanceStatus를 ApiSeatDistance로 변환
  const convertToApiSeatDistance = (
    distance: SeatDistanceStatus
  ): ApiSeatDistance => {
    const mapping: Record<SeatDistanceStatus, ApiSeatDistance> = {
      좁아요: 'NARROW',
      평범해요: 'AVERAGE',
      넓어요: 'WIDE',
    };
    return mapping[distance];
  };

  // FormData의 SoundStatus를 ApiSound로 변환
  const convertToApiSound = (sound: SoundStatus): ApiSound => {
    const mapping: Record<SoundStatus, ApiSound> = {
      '잘 안 들려요': 'POOR',
      평범해요: 'AVERAGE',
      선명해요: 'CLEAR',
    };
    return mapping[sound];
  };

  const newReview: ApiReview = {
    reviewId: mockApiReviews.length + 1,
    seatId: Date.now(), // 임시 seatId 생성
    concertId: data.concertId,
    content: data.content,
    userId: 1,
    viewScore: data.viewScore,
    seatDistance: convertToApiSeatDistance(data.seatDistance),
    sound: convertToApiSound(data.sound),
    photoUrl: data.photo ? `/images/uploaded-review-${Date.now()}.jpg` : null,
    writeTime: new Date().toISOString(),
    modifyTime: new Date().toISOString(),
    stageType: 1, // 기본값 설정
    userNickname: '작성자',
    userLevel: 'ROOKIE',
    concertTitle: '콘서트 제목', // 실제로는 DB에서 가져와야 함
  };

  mockApiReviews.push(newReview);
  return newReview;
};
