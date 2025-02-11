/**
 * @component SightReviewCard
 * @description 공연장 좌석의 리뷰 정보를 표시하는 카드 컴포넌트.
 * 콘서트 정보, 작성자 정보, 리뷰 이미지, 좌석 평가 정보 등을 포함합니다.
 *
 * @features
 * - 리뷰 작성자 정보 헤더 표시
 * - 리뷰 이미지 갤러리
 * - 시야/음향/좌석 품질 평가 표시
 * - 리뷰 본문 내용 표시
 */
import React from 'react';
import { ReviewHeader } from './ReviewHeader';
import { ReviewImages } from './ReviewImages';
import { ReviewContent } from './ReviewContent';

// 타입 정의
type SeatDistanceStatus = '좁아요' | '평범해요' | '넓어요';
type SoundStatus = '잘 안 들려요' | '평범해요' | '선명해요';

// 리뷰 카드 컴포넌트의 Props 인터페이스 정의
interface SightReviewCardProps {
  concertTitle: string;
  nickName: string;
  profilePicture: string;
  writerId: number;
  reviewId: number;
  seatInfo: string;
  images: string[];
  content: string;
  soundQuality: SoundStatus;
  seatQuality: SeatDistanceStatus;
  viewQuality: number;
}

export const SightReviewCard = ({
  concertTitle,
  writerId,
  reviewId,
  nickName,
  profilePicture,
  seatInfo,
  images,
  content,
  soundQuality,
  seatQuality,
  viewQuality,
}: SightReviewCardProps) => {
  // 시야 점수를 별점으로 표시하는 함수
  const renderViewScore = (score: number) => {
    return `${score}점`;
  };

  return (
    <div className="w-full rounded-lg p-4">
      <ReviewHeader
        reviewId={reviewId}
        writerId={writerId}
        concertTitle={concertTitle}
        nickName={nickName}
        profilePicture={profilePicture}
        seatInfo={seatInfo}
      />

      <ReviewImages images={images} />

      <div className="mb-4 flex gap-2 font-pretendard text-sm">
        <span className="text-caption1-bold"></span>
        <span className="text-gray-600">{renderViewScore(viewQuality)}</span>
        <span className="text-caption1-bold">|</span>
        <span className="text-caption1-bold text-sight-badge">음향</span>
        <span className="text-gray-600">{soundQuality}</span>
        <span className="text-caption1-bold">|</span>
        <span className="text-caption1-bold text-sight-badge">좌석</span>
        <span className="text-gray-600">{seatQuality}</span>
      </div>

      <ReviewContent content={content} />
    </div>
  );
};

export default SightReviewCard;
