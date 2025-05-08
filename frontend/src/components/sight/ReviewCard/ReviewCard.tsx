'use client';

import Image from 'next/image';
import styles from './ReviewCard.module.scss';
import {
  ReviewCardProps,
  ArtistGrade,
  StageGrade,
  ScreenGrade,
  GradeOption,
} from '@/types/review';
import { ReviewHeader } from './ReviewHeader';
import {
  ARTIST_GRADE_OPTIONS,
  STAGE_GRADE_OPTIONS,
  SCREEN_GRADE_OPTIONS,
} from '@/lib/constants/review';
import { useImageScroller } from '@/hooks/useImageScroller';
import { useTruncatedText } from '@/hooks/useTruncatedText';

// 기본 등급 정보 (fallback)
const defaultGradeInfo = { label: '정보 없음', color: '#dddddd' };

// 옵션 배열에서 값을 찾는 헬퍼 함수
const findOptionByValue = <T extends string | number>(
  options: GradeOption<T>[],
  value: T | undefined
): { label: string; color: string } => {
  if (!value) return defaultGradeInfo;
  const option = options.find((opt) => opt.value === value);
  return option
    ? { label: option.label, color: option.color }
    : defaultGradeInfo;
};

export const ReviewCard = ({ review, onEdit, onDelete }: ReviewCardProps) => {
  // 이미지 스크롤 관련 로직 분리
  const photoCount = review.photos?.length || 0;
  const {
    photoScrollerRef,
    activePhotoIndex,
    isDragging,
    scrollToPhoto,
    handleMouseDown,
    handleMouseMove,
    handleDragEnd,
  } = useImageScroller(photoCount);

  // 텍스트 자르기 관련 로직 분리
  const MAX_TEXT_LENGTH = 30;
  const { displayText, isLongContent, toggleContent, showFullContent } =
    useTruncatedText(review.content, MAX_TEXT_LENGTH);

  // 각 등급 정보 가져오기 (constants 활용)
  const artistInfo = findOptionByValue(
    ARTIST_GRADE_OPTIONS,
    review.artistGrade
  );
  const stageInfo = findOptionByValue(STAGE_GRADE_OPTIONS, review.stageGrade);
  const screenInfo = findOptionByValue(
    SCREEN_GRADE_OPTIONS,
    review.screenGrade
  );

  // 등급 뱃지 렌더링 함수
  const renderGradeBadge = (
    label: string,
    info: { label: string; color: string }
  ) => (
    <div
      className={styles.gradeBadge}
      style={{
        backgroundColor: `${info.color}20`, // 20은 투명도
        color: info.color,
      }}
    >
      <span className={styles.gradeLabel}>{label}</span>
      <span className={styles.gradeValue}>{info.label}</span>
    </div>
  );

  return (
    <div className={styles.reviewCard}>
      {/* 리뷰 헤더 */}
      <ReviewHeader review={review} onEdit={onEdit} />

      {/* 리뷰 사진 (가로 스크롤) */}
      {review.photos && review.photos.length > 0 && (
        <div className={styles.photoContainer}>
          {/* 이미지 갤러리 힌트 표시 (둘 이상의 이미지가 있을 때만) */}
          {review.photos.length > 1 && (
            <div className={styles.galleryHint}>
              <span className={styles.galleryCount}>
                {activePhotoIndex + 1}/{review.photos.length}
              </span>
            </div>
          )}

          {/* 가로 스크롤 컨테이너 */}
          <div
            className={`${styles.photoScroller} ${
              isDragging ? styles.grabbing : styles.grab
            }`}
            ref={photoScrollerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {review.photos.map((photo, index) => (
              <div key={photo.reviewPhotoId} className={styles.photoWrapper}>
                <Image
                  src={photo.photoUrl}
                  alt={`리뷰 사진 ${index + 1}`}
                  width={0}
                  height={0}
                  sizes='100vw'
                  className={styles.reviewPhoto}
                  draggable={false} // 이미지 드래그 방지
                />

                {/* 다음 이미지 미리보기 표시 (마지막 이미지가 아닐 때) */}
                {index < review.photos.length - 1 && (
                  <div className={styles.nextImageHint} />
                )}
              </div>
            ))}
          </div>

          {/* 페이지 인디케이터 (점) */}
          {review.photos.length > 1 && (
            <div className={styles.photoIndicator}>
              {review.photos.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.indicatorDot} ${
                    index === activePhotoIndex ? styles.activeDot : ''
                  }`}
                  onClick={() => scrollToPhoto(index)}
                  aria-label={`사진 ${index + 1}번 보기`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 리뷰 내용 */}
      <div className={styles.reviewContent}>
        <p className={styles.contentText}>{displayText}</p>
        {/* {isLongContent && (
          <button
            className={styles.readMoreBtn}
            onClick={toggleContent}
            aria-expanded={showFullContent}
          >
            {showFullContent ? '접기' : '더 보기'}
          </button> */}
        {/* )} */}
      </div>

      {/* 등급 뱃지 */}
      <div className={styles.gradeContainer}>
        {renderGradeBadge('아티스트', artistInfo)}
        {renderGradeBadge('무대', stageInfo)}
        {renderGradeBadge('스크린', screenInfo)}
      </div>
    </div>
  );
};
