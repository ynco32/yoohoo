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

// 리뷰 사진 타입 (ERD의 REVIEW_PHOTO 테이블)
export interface ReviewPhoto {
  reviewPhotoId: number; // review_photo_id
  reviewId: number; // review_id
  photoUrl: string; // photo_url
}

// 좌석 정보 인터페이스
export interface SeatInfo {
  seatId: number; // seat_id (ERD에 맞춤)
  section?: string; // 클라이언트 측에서 사용 (UI용)
  rowLine?: number; // 클라이언트 측에서 사용 (UI용)
  columnLine?: number; // 클라이언트 측에서 사용 (UI용)
}

// 리뷰 생성 요청 데이터 타입
export interface ReviewRequest {
  concertId: number; // concert_id
  seatId: number; // seat_id
  artistGrade: ArtistGrade;
  stageGrade: StageGrade;
  screenGrade: ScreenGrade;
  content: string;
  cameraBrand?: string;
  cameraModel?: string;
  photos?: string[]; // 사진 URL 배열 (업로드용)
}

// API 응답용 리뷰 타입
export interface Review {
  reviewId: number;
  seatId: number;
  content: string;
  artistGrade?: number;
  stageGrade?: number;
  screenGrade?: number;
  photos?: {
    reviewPhotoId: number;
    photoUrl: string;
  }[];
  createdAt: string;
  updatedAt: string;
  authorName: string;
  authorProfileImage?: string;
}

// 선택 옵션 인터페이스
export interface GradeOption<T> {
  value: T;
  label: string;
  color: string;
}

// UI 표시용 리뷰 데이터 타입
export interface ReviewData {
  reviewId: number; // review_id
  userId: number; // user_id

  concertId: number; // concert_id
  concertTitle: string; // 클라이언트용 (서버에서 조인 결과)
  seatId: number; // seat_id

  // 클라이언트 UI용 좌석 정보 (서버에서 조인하거나 클라이언트에서 가공)
  section: string;
  rowLine: number;
  columnLine: number;

  artistGrade: ArtistGrade;
  stageGrade: StageGrade;
  screenGrade: ScreenGrade;
  content: string;
  cameraBrand?: string;
  cameraModel?: string;
  createdAt: string; // created_at

  // 작성자 정보 (서버에서 조인 결과)
  nickName: string;
  profilePicture: string;

  // 리뷰 사진 정보 (서버에서 조인 결과)
  photos: ReviewPhoto[];

  // 좌석 정보 문자열 생성 헬퍼 메서드
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
