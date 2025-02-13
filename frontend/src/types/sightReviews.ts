// types/sightReview.ts

export enum StageType {
  ALL = 0,
  STANDARD = 1,
  EXTENDED = 2,
  DEGREE_360 = 3,
}

export const STATUS_MAPPINGS = {
  seatDistance: {
    좁아요: 'NARROW',
    평범해요: 'AVERAGE',
    넓어요: 'WIDE',
  },
  sound: {
    '잘 안 들려요': 'POOR',
    평범해요: 'AVERAGE',
    선명해요: 'CLEAR',
  },
} as const;

// 기본 상태 타입들
export type SeatDistanceStatus = '좁아요' | '평범해요' | '넓어요';
export type SoundStatus = '잘 안 들려요' | '평범해요' | '선명해요';

// API 응답에서 사용하는 상태값들
export type ApiSeatDistance = 'NARROW' | 'AVERAGE' | 'WIDE';
export type ApiSound = 'POOR' | 'AVERAGE' | 'CLEAR';

// API 응답 타입
export interface SightReviewData {
  reviewId: number;
  seatId: number;
  rowLine: number;
  columnLine: number;
  concertId: number;
  content: string;
  viewScore: number;
  seatDistance: SeatDistanceStatus;
  sound: SoundStatus;
  photoUrl: string | null;
  writeTime: string;
  modifyTime: string;
  stageType: StageType;
  level: string;
  nickname: string | null;
  concertName: string;
  userId: number;
}

// API 요청 타입
export interface CreateSightReviewRequest {
  concertId: number;
  sectionNumber: number;
  rowLine: number;
  columnLine: number;
  content: string;
  viewScore: number;
  seatDistance: ApiSeatDistance;
  sound: ApiSound;
}

// 폼 데이터 타입
export interface SightReviewFormData {
  concertId: number;
  sectionNumber: number;
  rowLine: number;
  columnLine: number;
  photo: File | null;
  viewScore: number;
  seatDistance: SeatDistanceStatus;
  sound: SoundStatus;
  content: string;
}

// API 응답 원본 타입
export interface ApiReview {
  reviewId: number;
  seatId: number;
  rowLine: number;
  columnLine: number;
  concertId: number;
  content: string;
  viewScore: number;
  userId: number;
  seatDistance: ApiSeatDistance;
  sound: ApiSound;
  photoUrl: string | null;
  writeTime: string;
  modifyTime: string;
  stageType: string;
  level: string;
  nickname: string | null;
  concertName: string;
}

export interface ApiResponse {
  reviews: ApiReview[];
  review?: ApiReview;
}

// 폼 상태 관련 타입들
export interface FormState {
  values: SightReviewFormData;
  errors: FormErrors;
  touched: TouchedState;
  isValid: boolean;
  isSubmitting: boolean;
}

// 폼 유효성 검사 관련 타입들
export type FormErrors = Partial<
  Record<keyof SightReviewFormData | 'submit', string>
>;

export interface ValidationState {
  concertId: boolean;
  photo: boolean;
  viewScore: boolean;
  rowLine: boolean;
  columnLine: boolean;
  seatDistance: boolean;
  content: boolean;
}

export interface TouchedState {
  concertId: boolean;
  photo: boolean;
  viewScore: boolean;
  rowLine: boolean;
  columnLine: boolean;
  seatDistance: boolean;
  content: boolean;
}

export type ValidFields = keyof ValidationState;

type FieldValues = {
  [K in keyof SightReviewFormData]: SightReviewFormData[K];
};

export type FormAction =
  | {
      type: 'SET_FIELD_VALUE';
      field: keyof SightReviewFormData;
      value: FieldValues[keyof SightReviewFormData];
    }
  | { type: 'SET_FIELD_ERROR'; field: keyof FormErrors; error: string }
  | { type: 'SET_FIELD_TOUCHED'; field: keyof TouchedState }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET_FORM' };
