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
