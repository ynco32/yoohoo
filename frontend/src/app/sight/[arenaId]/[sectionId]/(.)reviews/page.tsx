'use client';

import { useCallback, useEffect, useRef } from 'react';
import styles from './ReviewsBottomSheet.module.scss';
import { ReviewCard } from '@/components/sight/ReviewCard/ReviewCard';
import { useBottomSheetGesture } from '@/hooks/useBottomSheetGesture';
import { useSectionReviews } from '@/hooks/useSectionReviews';
import { ArtistGrade, ScreenGrade, StageGrade } from '@/types/review';

interface ReviewsBottomSheetProps {
  arenaId: string;
  sectionId: string;
  selectedSeats: string[];
  onClose?: () => void; // 닫기 이벤트 핸들러 추가
}

export default function ReviewsBottomSheet({
  arenaId,
  sectionId,
  selectedSeats,
  onClose,
}: ReviewsBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null!);

  // 전체 리뷰인지 여부 확인
  const isAllSeats = selectedSeats.length === 0;

  // 구역 전체 리뷰 가져오기
  const {
    reviews: allReviews,
    isLoading,
    error,
  } = useSectionReviews(arenaId, sectionId);

  // 필터링된 리뷰 - 선택된 좌석이 없으면 모든 리뷰, 있으면 해당 좌석들의 리뷰만
  const filteredReviews = isAllSeats
    ? allReviews
    : allReviews.filter((review) =>
        selectedSeats.includes(review.seatId.toString())
      );

  // 바텀 시트 제스처 제어 훅 사용
  const {
    sheetHeight,
    isDragging,
    currentSnapPoint,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    closeSheet,
  } = useBottomSheetGesture({
    sheetRef,
    snapPoints: ['25%', '50%', '85%'],
    initialSnapPoint: 1, // 초기 높이는 50%
    onClose: () => {
      // 바텀시트가 닫힐 때 부모 컴포넌트에 알림
      if (onClose) onClose();
    },
  });

  // 바텀 시트 닫기
  const handleClose = useCallback(() => {
    closeSheet();
  }, [closeSheet]);

  // ESC 키 눌렀을 때 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  // ReviewCard에 필요한 형태로 review 데이터 변환
  const mapReviewForCard = (review: any) => {
    return {
      reviewId: review.reviewId || 0,
      nickname: review.nickname || '익명',
      concertName: review.concertName || '공연 정보 없음',
      arenaName: review.arenaName || '공연장 정보 없음',
      section: review.section || sectionId,
      seatId: review.seatId || 0,
      rowLine: review.rowLine || 0,
      columnLine: review.columnLine || 0,
      artistGrade: review.artistGrade || ArtistGrade.MODERATE,
      stageGrade: review.stageGrade || StageGrade.CLEAR,
      screenGrade: review.screenGrade || ScreenGrade.CLEAR,
      content: review.content || '',
      createdAt: review.createdAt || new Date().toISOString(),
      photoUrls: review.photoUrls || [],
      cameraBrand: review.cameraBrand,
      cameraModel: review.cameraModel,
    };
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div
        ref={sheetRef}
        className={styles.bottomSheet}
        style={{ height: `${sheetHeight}vh` }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 드래그 핸들 */}
        <div className={styles.dragHandle}>
          <div className={styles.dragIndicator} />
        </div>

        {/* 헤더 */}
        <div className={styles.sheetHeader}>
          <h2 className={styles.sheetTitle}>
            {isAllSeats
              ? '전체 좌석 리뷰'
              : selectedSeats.length > 1
              ? `${selectedSeats.length}개 좌석 리뷰`
              : `${selectedSeats[0]}번 좌석 리뷰`}
          </h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label='닫기'
          >
            ✕
          </button>
        </div>

        {/* 선택된 좌석 정보 (여러 좌석 선택 시만 표시) */}
        {selectedSeats.length > 1 && (
          <div className={styles.selectedSeatsInfo}>
            <div className={styles.seatsList}>
              {selectedSeats.map((seatId) => (
                <span key={seatId} className={styles.seatTag}>
                  {seatId}번
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 리뷰 리스트 */}
        <div className={styles.reviewList}>
          {isLoading ? (
            <div className={styles.loading}>리뷰를 불러오는 중...</div>
          ) : error ? (
            <div className={styles.error}>리뷰를 불러오는데 실패했습니다.</div>
          ) : filteredReviews.length === 0 ? (
            <div className={styles.emptyState}>
              <p>
                {isAllSeats
                  ? '이 구역에 리뷰가 없습니다.'
                  : '선택한 좌석에 대한 리뷰가 없습니다.'}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={mapReviewForCard(review)}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
