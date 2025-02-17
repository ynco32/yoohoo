'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getMyReviews } from '@/lib/api/sightReview';
import { mapApiToSightReview } from '@/lib/utils/sightReviewMapper';
import type { SightReviewData } from '@/types/sightReviews';
import { getUserProfileImage } from '@/lib/utils/profileCharacter';
import SightReviewCard from '../sight/review/SightReviewCard';

export function MySightReviewList() {
  const [reviews, setReviews] = useState<SightReviewData[]>([]);
  const [isReviewLoading, setIsReviewLoading] = useState(true);
  const [isReviewError, setReviewError] = useState<string | null>(null);

  const params = useParams();

  const arenaId = Number(params.arenaId);
  const sectionId = Number(params.sectionId);
  const seatId = Number(params.seatId);
  const stageType = Number(params.stageType);

  useEffect(() => {
    const fetchReviews = async () => {
      if (stageType === undefined || sectionId === undefined) {
        console.log('필수 파라미터 누락');
        return;
      }

      try {
        setIsReviewLoading(true);
        setReviewError(null);

        console.log('API 요청 파라미터:', {
          arenaId,
          stageType,
          section: sectionId,
          seatId,
        });

        const response = await getMyReviews();

        console.log('API 응답:', response);

        const mappedReviews = response.reviews.map((review) =>
          mapApiToSightReview(review)
        );

        setReviews(mappedReviews);
      } catch (err) {
        console.error('에러 발생:', err);
        setReviewError(
          err instanceof Error ? err.message : '리뷰를 불러오는데 실패했습니다.'
        );
      } finally {
        setIsReviewLoading(false);
      }
    };

    fetchReviews();
  }, [arenaId, stageType, sectionId, seatId]);

  if (isReviewLoading) {
    return <></>;
  }

  if (isReviewError) {
    return <></>;
  }

  return (
    <div className="px-4">
      <div className="rounded-t-3xl bg-white">
        {reviews.map((reviewData, index) => {
          return (
            <div
              key={`${reviewData.seatId}-${reviewData.reviewId}-${index}`}
              className="flex flex-col"
            >
              <SightReviewCard
                profilePicture={getUserProfileImage(reviewData.level)}
                writerId={reviewData.userId}
                concertTitle={reviewData.concertName}
                nickName={reviewData.nickname ?? 'Unknown'}
                reviewId={reviewData.reviewId}
                seatInfo={`${reviewData.rowLine}열 ${reviewData.columnLine}번`}
                image={reviewData.photoUrl}
                content={reviewData.content}
                viewQuality={reviewData.viewScore}
                soundQuality={reviewData.sound}
                seatDistance={reviewData.seatDistance}
                writeTime={reviewData.writeTime}
              />
              {index < reviews.length - 1 && (
                <hr className="border-t border-gray-100" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
