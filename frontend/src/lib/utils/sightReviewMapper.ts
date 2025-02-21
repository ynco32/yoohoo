// utils/sightReviewMapper.ts
import {
  SightReviewData,
  ApiReview,
  SeatDistanceStatus,
  SoundStatus,
  StageType,
  CreateSightReviewRequest,
  SightReviewFormData,
  STATUS_MAPPINGS,
} from '@/types/sightReviews';

export const mapApiToSightReview = (apiReview: ApiReview): SightReviewData => {
  // Map API values to frontend values
  const seatDistanceMap: Record<string, SeatDistanceStatus> = {
    NARROW: '좁아요',
    AVERAGE: '평범해요',
    WIDE: '넓어요',
  };

  const soundMap: Record<string, SoundStatus> = {
    POOR: '잘 안 들려요',
    AVERAGE: '평범해요',
    CLEAR: '선명해요',
  };

  return {
    reviewId: apiReview.reviewId,
    seatId: apiReview.seatId,
    rowLine: apiReview.rowLine,
    columnLine: apiReview.columnLine,
    concertId: apiReview.concertId,
    content: apiReview.content,
    viewScore: apiReview.viewScore,
    seatDistance: seatDistanceMap[apiReview.seatDistance],
    sound: soundMap[apiReview.sound],
    photoUrl: apiReview.photoUrl,
    writeTime: apiReview.writeTime,
    modifyTime: apiReview.modifyTime,
    stageType: StageType[apiReview.stageType as keyof typeof StageType],
    level: apiReview.level,
    nickname: apiReview.nickname,
    concertName: apiReview.concertName,
    userId: apiReview.userId,
  };
};

export const mapFormDataToApiRequest = (
  formData: Omit<SightReviewFormData, 'photo'>
): CreateSightReviewRequest => {
  return {
    ...formData,
    seatDistance: STATUS_MAPPINGS.seatDistance[formData.seatDistance],
    sound: STATUS_MAPPINGS.sound[formData.sound],
  };
};

export const mapApiToSeatDistance = (
  apiSeatDistance: string
): SeatDistanceStatus => {
  const seatDistanceMap: Record<string, SeatDistanceStatus> = {
    NARROW: '좁아요',
    AVERAGE: '평범해요',
    WIDE: '넓어요',
  };

  return seatDistanceMap[apiSeatDistance];
};

// 프론트엔드 seatDistance 값을 API 요청 값으로 변환
export const mapSeatDistanceToApi = (
  seatDistance: SeatDistanceStatus
): string => {
  const reverseSeatDistanceMap: Record<SeatDistanceStatus, string> = {
    좁아요: 'NARROW',
    평범해요: 'AVERAGE',
    넓어요: 'WIDE',
  };

  return reverseSeatDistanceMap[seatDistance];
};

// API 응답의 sound를 프론트엔드 값으로 변환
export const mapApiToSound = (apiSound: string): SoundStatus => {
  const soundMap: Record<string, SoundStatus> = {
    POOR: '잘 안 들려요',
    AVERAGE: '평범해요',
    CLEAR: '선명해요',
  };

  return soundMap[apiSound];
};

// 프론트엔드 sound 값을 API 요청 값으로 변환
export const mapSoundToApi = (sound: SoundStatus): string => {
  const reverseSoundMap: Record<SoundStatus, string> = {
    '잘 안 들려요': 'POOR',
    평범해요: 'AVERAGE',
    선명해요: 'CLEAR',
  };

  return reverseSoundMap[sound];
};
