// types/sightReview.ts
export enum StageType {
  STANDARD = 1,
  THEATER = 2,
  CONCERT = 3,
}
// 기본 상태 타입들
export type SeatDistanceStatus = '좁아요' | '평범해요' | '넓어요';
export type SoundStatus = '잘 안 들려요' | '평범해요' | '선명해요';
export type UserLevel = 'ROOKIE' | 'AMATEUR' | 'SEMI_PRO' | 'PROFESSIONAL';

// API 응답에서 사용하는 상태값들
export type ApiSeatDistance = 'NARROW' | 'AVERAGE' | 'WIDE';
export type ApiSound = 'UNCLEAR' | 'AVERAGE' | 'CLEAR';

// API 응답 타입
export interface SightReviewData {
  reviewId: number;
  arenaId: number;
  sectionId: number;
  seatId: number;
  concertId: number;
  concertTitle: string;
  content: string;
  nickName: string;
  profilePicture: string;
  seatInfo: string;
  images: string[];
  viewQuality: number;
  soundQuality: SoundStatus;
  seatQuality: SeatDistanceStatus;
  writeTime?: string;
  modifyTime?: string;
  stageType?: number;
}

// API 응답 원본 타입
export interface ApiReview {
  reviewId: number;
  seatId: number;
  concertId: number;
  content: string;
  viewScore: number;
  seatDistance: ApiSeatDistance;
  sound: ApiSound;
  photoUrl: string | null;
  writeTime: string;
  modifyTime: string;
  stageType: number;
  userNickname: string;
  userLevel: UserLevel;
  concertTitle: string;
}

export interface ApiResponse {
  reviews: ApiReview[];
}

// 폼 관련 타입들
export interface SightReviewFormData {
  concertId: number;
  section: number;
  rowLine: number;
  columnLine: number;
  images: File[];
  viewScore: number;
  seatDistance: SeatDistanceStatus;
  sound: SoundStatus;
  stageType: number;
  content: string;
}

export interface SeatInfo {
  section: number | null;
  rowLine: number | null;
  columnLine: number | null;
}

// 폼 유효성 검사 관련 타입들
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
