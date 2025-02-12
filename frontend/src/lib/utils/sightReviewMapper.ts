// utils/sightReviewMapper.ts
import { SightReviewData, ApiReview } from '@/types/sightReviews';
import { getUserProfileImage } from './profileCharacter';

export const mapApiToSightReview = (
  apiReview: ApiReview,
  currentArenaId: number,
  currentSectionId: number
): SightReviewData => {
  const seatDistanceMap = {
    NARROW: '좁아요',
    AVERAGE: '평범해요',
    WIDE: '넓어요',
  } as const;

  const soundMap = {
    UNCLEAR: '잘 안 들려요',
    AVERAGE: '평범해요',
    CLEAR: '선명해요',
  } as const;

  return {
    reviewId: apiReview.reviewId,
    arenaId: currentArenaId,
    sectionId: currentSectionId,
    seatId: apiReview.seatId,
    concertId: apiReview.concertId,
    concertTitle: apiReview.concertTitle,
    content: apiReview.content,
    writerId: apiReview.userId,
    nickName: apiReview.userNickname,
    profilePicture: getUserProfileImage(apiReview.userLevel),
    seatInfo: `${currentSectionId}구역 ${apiReview.seatId}번`,
    photoUrl: apiReview.photoUrl,
    viewQuality: apiReview.viewScore,
    soundQuality: soundMap[apiReview.sound],
    seatQuality: seatDistanceMap[apiReview.seatDistance],
    writeTime: apiReview.writeTime,
    modifyTime: apiReview.modifyTime,
    stageType: apiReview.stageType,
  };
};
