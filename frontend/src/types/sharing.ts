/**
 * 나눔 상태 타입
 */
export type SharingStatus = 'UPCOMING' | 'ONGOING' | 'CLOSED';

/**
 * 나눔 뷰 모드 타입
 */
export type ViewMode = 'list' | 'map';

/**
 * 나눔 게시글 정보
 */
export interface SharingPost {
  sharingId: number;      
  title: string;
  content?: string;      
  nickname: string;
  status: SharingStatus;
  startTime: string;      
  photoUrl: string | null; 
  latitude?: number;
  longitude?: number;
}

/**
 * 나눔 상태별 스타일과 텍스트 정보
 */
export const STATUS_INFO = {
  ONGOING: { color: 'bg-status-success', text: '진행중' },
  UPCOMING: { color: 'bg-status-caution', text: '준비중' },
  CLOSED: { color: 'bg-gray-400', text: '마감' },
} as const;
