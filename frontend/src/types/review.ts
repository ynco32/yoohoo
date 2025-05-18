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

// 리뷰 사진 타입
export interface ReviewPhoto {
  reviewPhotoId: number;
  reviewId: number;
  photoUrl: string;
}

// API 응답용 리뷰 타입 (실제 API 응답에 맞게 수정)
export interface Review {
  reviewId: number;
  nickname: string;
  concertName: string;
  arenaName: string;
  seatId: number;
  section: string;
  rowLine: string; // API 응답에 맞게 string으로 변경
  columnLine: number;
  artistGrade: ArtistGrade;
  stageGrade: StageGrade;
  screenGrade: ScreenGrade;
  content: string;
  cameraBrand?: string;
  cameraModel?: string;
  createdAt: string;
  photoUrls: string[];
}

// 선택 옵션 인터페이스
export interface GradeOption<T> {
  value: T;
  label: string;
  color: string;
}

// UI 표시용 리뷰 데이터 타입 (ReviewHeader에서 필요로 하는 형식)
export interface ReviewData {
  reviewId: number;
  userId: number;
  concertId: number;
  concertTitle: string;
  seatId: number;
  section: string;
  rowLine: string;
  columnLine: number;
  artistGrade: ArtistGrade;
  stageGrade: StageGrade;
  screenGrade: ScreenGrade;
  content: string;
  cameraBrand?: string;
  cameraModel?: string;
  createdAt: string;
  nickName: string;
  profilePicture: string;
  photos: ReviewPhoto[];
  getSeatInfoString(): string;
}

// ReviewHeader 컴포넌트 Props
export interface ReviewHeaderProps {
  review: ReviewData;
  onEdit?: () => void;
}

// ReviewCard 컴포넌트 Props
export interface ReviewCardProps {
  review: Review;
  onEdit?: () => void;
  onDelete?: () => void;
}

// 리뷰 생성 요청 데이터 타입
export interface ReviewRequest {
  concertId: number;
  section: string;
  rowLine: string;
  columnLine: number;
  artistGrade: ArtistGrade;
  stageGrade: StageGrade;
  screenGrade: ScreenGrade;
  content: string;
  cameraBrand?: string;
  cameraModel?: string;
  photos?: string[];
}

// 리뷰 수정 요청 데이터 타입 (추가)
export interface ReviewUpdateRequest {
  concertId: number;
  section: string;
  rowLine: string;
  columnLine: number;
  artistGrade: ArtistGrade;
  stageGrade: StageGrade;
  screenGrade: ScreenGrade;
  content: string;
  cameraBrand?: string;
  cameraModel?: string;
  existingPhotoUrls: string[];
}

export interface ReviewListApi {
  reviewList: Review[];
}
