// src/types/review.ts

export enum ArtistGrade {
  VERY_CLOSE = 'VERY_CLOSE',
  CLOSE = 'CLOSE',
  MODERATE = 'MODERATE',
  FAR = 'FAR',
  VERY_FAR = 'VERY_FAR',
}

export enum StageGrade {
  CLEAR = 'CLEAR',
  SIDE = 'SIDE',
  BLOCKED = 'BLOCKED',
}

export enum ScreenGrade {
  CLEAR = 'CLEAR',
  SIDE = 'SIDE',
  BLOCKED = 'BLOCKED',
}

export interface ReviewRequestDTO {
  concertId: number;
  section: string;
  rowLine: number;
  columnLine: number;
  artistGrade: ArtistGrade;
  stageGrade: StageGrade;
  screenGrade: ScreenGrade;
  content: string;
  cameraBrand?: string;
  cameraModel?: string;
}

export interface ReviewResponse {
  reviewId: number;
}

// 선택 옵션 인터페이스 추가
export interface GradeOption<T> {
  value: T;
  label: string;
  color: string;
}

// 아티스트 시야 등급 옵션
export const ARTIST_GRADE_OPTIONS: GradeOption<ArtistGrade>[] = [
  {
    value: ArtistGrade.VERY_CLOSE,
    label: '아이컨택이 가능해요',
    color: '#4ADE80',
  },
  { value: ArtistGrade.CLOSE, label: '표정이 보여요', color: '#FACC15' },
  {
    value: ArtistGrade.MODERATE,
    label: '전광판을 봐야 해요',
    color: '#FACC15',
  },
  { value: ArtistGrade.FAR, label: '일광귀에 필요해요', color: '#FB7185' },
  { value: ArtistGrade.VERY_FAR, label: '갈은 곳에 있어요', color: '#F43F5E' },
];

// 스크린 시야 등급 옵션
export const SCREEN_GRADE_OPTIONS: GradeOption<ScreenGrade>[] = [
  { value: ScreenGrade.CLEAR, label: '잘 보여요', color: '#4ADE80' },
  { value: ScreenGrade.SIDE, label: '측면이에요', color: '#FACC15' },
  { value: ScreenGrade.BLOCKED, label: '가려요', color: '#F43F5E' },
];

// 무대 시야 등급 옵션
export const STAGE_GRADE_OPTIONS: GradeOption<StageGrade>[] = [
  { value: StageGrade.CLEAR, label: '잘 보여요', color: '#4ADE80' },
  { value: StageGrade.SIDE, label: '측면이에요', color: '#FACC15' },
  { value: StageGrade.BLOCKED, label: '가려요', color: '#F43F5E' },
];
