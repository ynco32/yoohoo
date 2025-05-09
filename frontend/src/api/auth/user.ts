// 마이페이지 임시 API 데이터 타입 및 더미 데이터

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

// 리뷰 인터페이스
export interface UserReview {
  id: string;
  concertTitle: string;
  venueName: string;
  seatInfo: string;
  reviewPreview: string;
  imageUrl?: string;
  createdAt: string;
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
    posterUrl: '/images/concert1.jpg',
  },
  {
    id: 'concert2',
    title: 'KATION IN SEOUL',
    dateRange: '2025. 3. 1(월) - 2025. 3. 5(금)',
    posterUrl: '/images/concert2.jpg',
  },
  {
    id: 'concert3',
    title: 'SHINee WORLD VIII ESSAY',
    dateRange: '2025. 3. 1(월) - 2025. 3. 5(금)',
    posterUrl: '/images/concert3.jpg',
  },
  {
    id: 'concert4',
    title: 'COLDPLAY MUSIC OF THE SPHERES',
    dateRange: '2025. 5. 10(토) - 2025. 5. 15(목)',
    posterUrl: '/images/concert4.jpg',
  },
];

const DUMMY_ARTISTS: UserArtist[] = [
  {
    id: 'artist1',
    name: 'NCT',
    imageUrl: '/images/artist1.jpg',
  },
  {
    id: 'artist2',
    name: 'BTS',
    imageUrl: '/images/artist2.jpg',
  },
  {
    id: 'artist3',
    name: '더보이즈',
    imageUrl: '/images/artist3.jpg',
  },
];

const DUMMY_REVIEWS: UserReview[] = [
  {
    id: 'review1',
    concertTitle: 'NCT DREAM TOUR "THE DREAM SHOW 3"',
    venueName: '고척스카이돔',
    seatInfo: '1층 R석 12열 5번',
    reviewPreview:
      '음향도 좋고 시야도 좋았어요. 다만 거리가 조금 있어서 표정은 잘 안 보였지만 전체적으로 만족스러웠습니다.',
    imageUrl: '/images/review1.jpg',
    createdAt: '2025.04.10',
  },
  {
    id: 'review2',
    concertTitle: 'SEVENTEEN TOUR "FOLLOW"',
    venueName: '서울월드컵경기장',
    seatInfo: '2층 C석 5열 20번',
    reviewPreview:
      '2층이라 멀긴 했지만 시야는 나쁘지 않았어요. 큰 화면으로 잘 볼 수 있었습니다.',
    imageUrl: '/images/review2.jpg',
    createdAt: '2025.03.22',
  },
  {
    id: 'review3',
    concertTitle: 'IVE THE 1ST WORLD TOUR "SHOW WHAT I HAVE"',
    venueName: 'KSPO DOME',
    seatInfo: '스탠딩 B구역',
    reviewPreview:
      '스탠딩이라 힘들었지만 가까이서 볼 수 있어서 좋았어요. 음향도 괜찮았습니다.',
    imageUrl: '/images/review3.jpg',
    createdAt: '2025.02.15',
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

export async function getUserReviews(): Promise<UserReview[]> {
  // 실제 구현에서는 DB에서 사용자의 리뷰 데이터를 가져옴
  await new Promise((resolve) => setTimeout(resolve, 600)); // 서버 요청 시뮬레이션
  return DUMMY_REVIEWS;
}
