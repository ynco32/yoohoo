'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import IconBox from '@/components/common/IconBox/IconBox';
import styles from './ReviewSection.module.scss';
import { ReviewCard } from '@/components/mypage/ReviewCard/ReviewCard';
import { Review } from '@/types/review';

interface ReviewSectionProps {
  reviews: Review[];
}

export default function ReviewSection({ reviews }: ReviewSectionProps) {
  const router = useRouter();
  
  const handleReviewClick = (reviewId: number) => {
    router.push(`/mypage/sight/${reviewId}`);
  };
  
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <IconBox name="edit" size={24} color="#4986e8" />
          <h2 className={styles.title}>내 시야 후기</h2>
        </div>
        <Link href="/mypage/sight" className={styles.viewAll}>
          전체보기
        </Link>
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
          <Link href="/sight" className={styles.writeButton}>
            후기 작성하기
          </Link>
        </div>
      )}
    </section>
  );
}