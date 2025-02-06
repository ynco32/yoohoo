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
 *
 * @props
 * @prop {string} concertTitle - 공연 제목
 * @prop {string} nickName - 리뷰 작성자 닉네임
 * @prop {string} profilePicture - 작성자 프로필 이미지 URL
 * @prop {string} seatInfo - 좌석 위치 정보
 * @prop {string[]} images - 리뷰 이미지 URL 배열
 * @prop {string} content - 리뷰 본문 내용
 * @prop {string} soundQuality - 음향 품질 평가
 * @prop {string} seatQuality - 좌석 품질 평가
 * @prop {string} viewQuality - 시야 품질 평가
 *
 * @example
 * ```jsx
 * <SightReviewCard
 *   concertTitle="BTS Concert"
 *   nickName="ARMY"
 *   profilePicture="/profile.jpg"
 *   seatInfo="1층 A구역 15열 23번"
 *   images={['img1.jpg', 'img2.jpg']}
 *   content="시야가 매우 좋았습니다!"
 *   soundQuality="음향 좋음"
 *   seatQuality="좌석 편안함"
 *   viewQuality="시야 매우 좋음"
 * />
 * ```
 *
 * @dependencies
 * - React
 * - ./ReviewHeader
 * - ./ReviewImages
 * - ./ReviewContent
 */
import React from 'react';
import { ReviewHeader } from './ReviewHeader';
import { ReviewImages } from './ReviewImages';
import { ReviewContent } from './ReviewContent';

// 리뷰 카드 컴포넌트의 Props 인터페이스 정의
interface SightReviewCardProps {
  concertTitle: string; // 공연 제목
  nickName: string; // 리뷰 작성자 닉네임
  profilePicture: string; // 작성자 프로필 이미지
  seatInfo: string; // 좌석 위치 정보
  images: string[]; // 리뷰 이미지 URL 배열
  content: string; // 리뷰 본문 내용
  soundQuality: string; // 음향 품질 평가
  seatQuality: string; // 좌석 품질 평가
  viewQuality: string; // 시야 품질 평가
}

export const SightReviewCard = ({
  concertTitle,
  nickName,
  profilePicture,
  seatInfo,
  images,
  content,
  soundQuality,
  seatQuality,
  viewQuality,
}: SightReviewCardProps) => {
  return (
    // 리뷰 카드 컨테이너
    <div className="w-full rounded-lg p-4">
      {/* 리뷰 헤더 섹션: 공연 정보 및 작성자 정보 */}
      <ReviewHeader
        concertTitle={concertTitle}
        nickName={nickName}
        profilePicture={profilePicture}
        seatInfo={seatInfo}
      />

      {/* 리뷰 이미지 갤러리 섹션 */}
      <ReviewImages images={images} />

      {/* 좌석 평가 정보 섹션 */}
      <div className="0 mb-4 flex gap-2 font-pretendard text-sm">
        <span className="text-caption1-bold">하나님석</span>
        <span className="text-gray-600">{viewQuality}</span>
        <span className="text-caption1-bold">|</span>
        <span className="text-sight-badge text-caption1-bold">음향</span>
        <span className="text-gray-600">{soundQuality}</span>
        <span className="text-caption1-bold">|</span>
        <span className="text-sight-badge text-caption1-bold">좌석</span>
        <span className="text-gray-600">{seatQuality}</span>
      </div>

      {/* 리뷰 본문 내용 섹션 */}
      <ReviewContent content={content} />
    </div>
  );
};

export default SightReviewCard;
