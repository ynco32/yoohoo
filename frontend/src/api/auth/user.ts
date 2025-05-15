import { ArtistGrade, StageGrade, ScreenGrade, Review } from '@/types/review';

// 사용자 프로필 인터페이스
export interface UserProfile {
  id: string;
  nickname: string;
  profileImageUrl?: string;
}

// 콘서트 인터페이스
export interface UserConcert {
  id: string;
  title: string;
  dateRange: string;
  posterUrl?: string;
}

// 아티스트 인터페이스
export interface UserArtist {
  id: string;
  name: string;
  imageUrl?: string;
}

// 더미 데이터 (실제 구현에서는 DB에서 가져옴)
const DUMMY_USER: UserProfile = {
  id: 'user123',
  nickname: '똘병이',
  profileImageUrl: '/svgs/main/profile.svg',
};

const DUMMY_CONCERTS: UserConcert[] = [
  {
    id: 'concert1',
    title: '2025 POKEMON 1st CONCERT<PIKA PIKA>',
    dateRange: '2025. 3. 1(월) - 2025. 3. 5(금)',
  },
  {
    id: 'concert2',
    title: 'KATION IN SEOUL',
    dateRange: '2025. 3. 1(월) - 2025. 3. 5(금)',
  },
  {
    id: 'concert3',
    title: 'SHINee WORLD VIII ESSAY',
    dateRange: '2025. 3. 1(월) - 2025. 3. 5(금)',
  },
  {
    id: 'concert4',
    title: 'COLDPLAY MUSIC OF THE SPHERES',
    dateRange: '2025. 5. 10(토) - 2025. 5. 15(목)',
  },
];

const DUMMY_ARTISTS: UserArtist[] = [
  {
    id: 'artist1',
    name: 'NCT',
  },
  {
    id: 'artist2',
    name: 'BTS',
  },
  {
    id: 'artist3',
    name: '더보이즈',
  },
  {
    id: 'artist4',
    name: '더보이즈',
  },
  {
    id: 'artist5',
    name: '더보이즈',
  },
  {
    id: 'artist6',
    name: '더보이즈',
  },
  {
    id: 'artist7',
    name: '더보이즈',
  },
];

// 기존 리뷰 타입에 맞는 더미 데이터
const DUMMY_REVIEWS: Review[] = [
  {
    reviewId: 1,
    nickname: '똘병이',
    concertName: 'NCT DREAM TOUR "THE DREAM SHOW 3"',
    arenaName: '고척스카이돔',
    seatId: 101,
    section: '1',
    rowLine: '12',
    columnLine: 5,
    artistGrade: ArtistGrade.CLOSE,
    stageGrade: StageGrade.CLEAR,
    screenGrade: ScreenGrade.CLEAR,
    content:
      '음향도 좋고 시야도 좋았어요. 다만 거리가 조금 있어서 표정은 잘 안 보였지만 전체적으로 만족스러웠습니다.',
    cameraBrand: 'APPLE',
    cameraModel: 'iPhone 15 Pro',
    createdAt: '2025-04-10T15:30:00.000Z',
    photoUrls: ['/images/dummyConcert.jpg', '/images/dummyConcert.jpg'],
  },
  {
    reviewId: 2,
    nickname: '똘병이',
    concertName: 'SEVENTEEN TOUR "FOLLOW"',
    arenaName: '서울월드컵경기장',
    seatId: 202,
    section: '2',
    rowLine: '5',
    columnLine: 20,
    artistGrade: ArtistGrade.MODERATE,
    stageGrade: StageGrade.SIDE,
    screenGrade: ScreenGrade.CLEAR,
    content:
      '2층이라 멀긴 했지만 시야는 나쁘지 않았어요. 큰 화면으로 잘 볼 수 있었습니다.',
    cameraBrand: 'SAMSUNG',
    cameraModel: 'Galaxy S24',
    createdAt: '2025-03-22T14:20:00.000Z',
    photoUrls: ['/images/dummyConcert.jpg'],
  },
  {
    reviewId: 3,
    nickname: '똘병이',
    concertName: 'IVE THE 1ST WORLD TOUR "SHOW WHAT I HAVE"',
    arenaName: 'KSPO DOME',
    seatId: 303,
    section: 'B',
    rowLine: '0', // 스탠딩은 열 번호가 없으므로 0으로 설정
    columnLine: 0, // 스탠딩은 좌석 번호가 없으므로 0으로 설정
    artistGrade: ArtistGrade.VERY_CLOSE,
    stageGrade: StageGrade.CLEAR,
    screenGrade: ScreenGrade.SIDE,
    content:
      '스탠딩이라 힘들었지만 가까이서 볼 수 있어서 좋았어요. 음향도 괜찮았습니다.',
    cameraBrand: 'SONY',
    cameraModel: 'Alpha 7 IV',
    createdAt: '2025-02-15T18:45:00.000Z',
    photoUrls: [
      '/images/dummyConcert.jpg',
      '/images/review3_2.jpg',
      '/images/review3_3.jpg',
    ],
  },
  {
    reviewId: 4,
    nickname: '똘병이',
    concertName: 'IVE THE 1ST WORLD TOUR "SHOW WHAT I HAVE"',
    arenaName: 'KSPO DOME',
    seatId: 303,
    section: 'B',
    rowLine: '0', // 스탠딩은 열 번호가 없으므로 0으로 설정
    columnLine: 0, // 스탠딩은 좌석 번호가 없으므로 0으로 설정
    artistGrade: ArtistGrade.VERY_CLOSE,
    stageGrade: StageGrade.CLEAR,
    screenGrade: ScreenGrade.SIDE,
    content:
      '스탠딩이라 힘들었지만 가까이서 볼 수 있어서 좋았어요. 음향도 괜찮았습니다.',
    cameraBrand: 'SONY',
    cameraModel: 'Alpha 7 IV',
    createdAt: '2025-02-15T18:45:00.000Z',
    photoUrls: [
      '/images/dummyConcert.jpg',
      '/images/review3_2.jpg',
      '/images/review3_3.jpg',
    ],
  },
];

// 서버 컴포넌트에서 사용할 데이터 가져오기 함수들
// 실제 구현에서는 데이터베이스나 외부 API에서 데이터를 가져옴

export async function getUserProfile(): Promise<UserProfile> {
  // 실제 구현에서는 세션이나 쿠키에서 사용자 ID를 가져와 사용자 데이터를 조회함
  await new Promise((resolve) => setTimeout(resolve, 300)); // 서버 요청 시뮬레이션
  return DUMMY_USER;
}

export async function getUserConcerts(): Promise<UserConcert[]> {
  // 실제 구현에서는 DB에서 사용자의 콘서트 데이터를 가져옴
  await new Promise((resolve) => setTimeout(resolve, 500)); // 서버 요청 시뮬레이션
  return DUMMY_CONCERTS;
}

export async function getUserArtists(): Promise<UserArtist[]> {
  // 실제 구현에서는 DB에서 사용자의 아티스트 데이터를 가져옴
  await new Promise((resolve) => setTimeout(resolve, 400)); // 서버 요청 시뮬레이션
  return DUMMY_ARTISTS;
}

export async function getUserReviews(): Promise<Review[]> {
  // 실제 구현에서는 DB에서 사용자의 리뷰 데이터를 가져옴
  await new Promise((resolve) => setTimeout(resolve, 600)); // 서버 요청 시뮬레이션
  return DUMMY_REVIEWS;
}
