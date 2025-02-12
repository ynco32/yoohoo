// types/sightReview.ts
export enum StageType {
  ALL = 0,
  STANDARD = 1,
  EXTENDED = 2,
  DEGREE_360 = 3,
}
// 기본 상태 타입들
export type SeatDistanceStatus = '좁아요' | '평범해요' | '넓어요';
export type SoundStatus = '잘 안 들려요' | '평범해요' | '선명해요';
// export type UserLevel = '1' | '2' | '3' | '4';

// API 응답에서 사용하는 상태값들
export type ApiSeatDistance = 'NARROW' | 'AVERAGE' | 'WIDE';
export type ApiSound = 'POOR' | 'AVERAGE' | 'CLEAR';

// API 응답 타입
export interface SightReviewData {
  reviewId: number;
  arenaId: number;
  sectionId: number;
  seatId: number;
  concertId: number;
  concertTitle: string;
  content: string;
  writerId: number;
  nickName: string;
  profilePicture: string;
  seatInfo: string;
  photoUrl: string | null; // images 배열에서 단일 이미지로 변경
  viewQuality: number;
  soundQuality: SoundStatus;
  seatQuality: SeatDistanceStatus;
  writeTime?: string;
  modifyTime?: string;
  stageType?: number;
}

// 폼 관련 타입들
export interface SightReviewFormData {
  concertId: number;
  section: number;
  rowLine: number;
  columnLine: number;
  photo: File | null; // images 배열에서 단일 File로 변경
  viewScore: number;
  seatDistance: SeatDistanceStatus;
  sound: SoundStatus;
  stageType: number;
  content: string;
}

// API 응답 원본 타입
export interface ApiReview {
  reviewId: number;
  seatId: number;
  concertId: number;
  content: string;
  viewScore: number;
  userId: number;
  seatDistance: ApiSeatDistance;
  sound: ApiSound;
  photoUrl: string | null;
  writeTime: string;
  modifyTime: string;
  stageType: number;
  userNickname: string;
  userLevel: string;
  concertTitle: string;
}

export interface ApiResponse {
  reviews: ApiReview[];
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
