'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import IconBox from '@/components/common/IconBox/IconBox';
import styles from './ReviewSection.module.scss';
import { ReviewCard } from '@/components/mypage/ReviewCard/ReviewCard';
import { Review } from '@/types/review';
import { reviewApi } from '@/api/sight/review';

export default function ReviewSection() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await reviewApi.getMyReviews();
        setReviews(response?.reviewList || []);
      } catch (error) {
        console.error('리뷰 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleReviewClick = (reviewId: number) => {
    router.push(`/mypage/sight/${reviewId}`);
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <IconBox name='edit' size={24} color='#4986e8' />
            <h2 className={styles.title}>내 시야 후기</h2>
          </div>
        </div>
        <div>로딩 중...</div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <IconBox name='edit' size={24} color='#4986e8' />
          <h2 className={styles.title}>내 시야 후기</h2>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className={styles.reviewsGrid}>
          {reviews.map((review) => (
            <ReviewCard
              key={review.reviewId}
              review={review}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>작성한 후기가 없습니다</p>
          <Link href='/sight/reviews/write' className={styles.writeButton}>
            후기 작성하기
          </Link>
        </div>
      )}
    </section>
  );
}
