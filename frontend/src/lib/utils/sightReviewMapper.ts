// utils/sightReviewMapper.ts
import {
  SightReviewData,
  ApiReview,
  SeatDistanceStatus,
  SoundStatus,
  StageType,
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
