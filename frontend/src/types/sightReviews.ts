export type SeatDistanceStatus = '좁아요' | '평범해요' | '넓어요';
export type SoundStatus = '잘 안 들려요' | '평범해요' | '선명해요';
export type ViewQualityStatus = number; // viewScore로 변경되어 number 타입으로 수정

export interface SightReviewData {
  arenaId: number;
  sectionId: number;
  seatId: number;
  concertTitle: string;
  nickName: string;
  profilePicture: string;
  seatInfo: string;
  images: string[];
  content: string;
  viewQuality: ViewQualityStatus;
  soundQuality: string;
  seatQuality: string;
}

export interface SightReviewFormData {
  concertId: number;
  section: number;
  rowLine: number;
  columnLine: number;
  images: File[];
  viewScore: number;
  seatDistance: SeatDistanceStatus;
  sound: SoundStatus;
  content: string;
}

export interface SeatInfo {
  section: number | null;
  rowLine: number | null;
  columnLine: number | null;
}

export type FormErrors = Partial<
  Record<keyof SightReviewFormData | 'submit' | 'seat', string>
>;

export interface ValidationState {
  concertId: boolean;
  images: boolean;
  viewScore: boolean;
  seat: boolean;
  seatDistance: boolean;
  content: boolean;
}

export interface TouchedState {
  concertId: boolean;
  images: boolean;
  viewScore: boolean;
  seat: boolean;
  seatDistance: boolean;
  content: boolean;
}

export type ValidFields = keyof ValidationState;

// 목업 데이터는 유지
export const mockReviewData: SightReviewData[] = [
  {
    arenaId: 1,
    sectionId: 1,
    seatId: 2,
    concertTitle: '2025 BABYMONSTER 1st WORLD TOUR (HELLO MONSTERS) IN SEOUL',
    nickName: '닉네임닉네임',
    profilePicture: '/images/profile.png',
    seatInfo: '1구역 1열 2번',
    images: ['/images/sight.png'],
    content:
      '소학교 때 책상을 같이 했던 아이들의 이름과 때, 경, 옥 이런 이국소녀들의 이름과 떠써 아기 어머니된 계집애들의 이름과, 가난한 이웃 사람들의 이름과, 비둘기, 강아지, 토끼, 노루, 노루, 프랑시스 잠 ...',
    viewQuality: 5,
    soundQuality: '선명해요',
    seatQuality: '평범해요',
  },
  {
    arenaId: 1,
    sectionId: 102,
    seatId: 5,
    concertTitle: '2025 BABYMONSTER 1st WORLD TOUR (HELLO MONSTERS) IN SEOUL',
    nickName: '새벽리뷰어',
    profilePicture: '/images/profile.png',
    seatInfo: '102구역 1열 2번',
    images: ['/images/sight.png', '/images/sight.png'],
    content:
      '공연장 분위기가 정말 좋았어요. 특히 앵콜 무대에서 보여준 퍼포먼스는 잊을 수 없을 것 같아요!',
    viewQuality: 4,
    soundQuality: '선명해요',
    seatQuality: '넓어요',
  },
  {
    arenaId: 2,
    sectionId: 201,
    seatId: 7,
    concertTitle: '2025 BABYMONSTER 1st WORLD TOUR (HELLO MONSTERS) IN SEOUL',
    nickName: '콘서트매니아',
    profilePicture: '/images/profile.png',
    seatInfo: '201구역 1열 2번',
    images: [],
    content:
      '음향이 살짝 아쉬웠지만 무대는 정말 최고였습니다. 다음에도 꼭 보러 올게요!',
    viewQuality: 3,
    soundQuality: '잘 안 들려요',
    seatQuality: '좁아요',
  },
];
