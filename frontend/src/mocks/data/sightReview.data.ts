import { ApiResponse, ApiReview } from '@/types/sightReviews';

export const mockApiReviews: ApiReview[] = [
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
    photoUrl: 'https://example.com/review1.jpg',
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
    photoUrl: 'https://example.com/review3.jpg',
    writeTime: '2025-02-12T12:00:00',
    modifyTime: '2025-02-12T12:00:00',
    stageType: 'THEATER',
    level: '3',
    nickname: null,
    concertName: '2025 IU Concert',
  },
];

export const mockApiResponse: ApiResponse = {
  reviews: mockApiReviews,
};

// 폼 테스트용 mock 데이터
export const mockFormData = {
  concertId: 1001,
  rowLine: 3,
  columnLine: 5,
  photo: null,
  viewScore: 9,
  seatDistance: '좁아요',
  sound: '잘 안 들려요',
  stageType: 4, // DEGREE_360
  content: '좌석 리뷰 테스트입니다.',
};

// 검증 상태 mock 데이터
export const mockValidationState = {
  concertId: true,
  photo: true,
  viewScore: true,
  rowLine: true,
  columnLine: true,
  seatDistance: true,
  content: true,
};

export const mockTouchedState = {
  concertId: true,
  photo: false,
  viewScore: true,
  rowLine: true,
  columnLine: true,
  seatDistance: true,
  content: true,
};
