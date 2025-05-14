// src/pages/sight/reviews/[reviewId].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useReview } from '@/hooks/useReview';
import { ArtistGrade, StageGrade, ScreenGrade } from '@/types/review';
import {
  ARTIST_GRADE_OPTIONS,
  SCREEN_GRADE_OPTIONS,
  STAGE_GRADE_OPTIONS,
} from '@/lib/constants/review';
import styles from '@/styles/ReviewDetail.module.scss';

// 각 등급에 맞는 옵션 찾기 헬퍼 함수
const getGradeOption = (
  grade: ArtistGrade | StageGrade | ScreenGrade,
  options: any[]
) => {
  return options.find((option) => option.value === grade) || options[0];
};

export default function ReviewDetailPage() {
  const router = useRouter();
  const { reviewId } = router.query;
  const { review, isLoading, error, deleteReview } = useReview(
    reviewId as string
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // 삭제 다이얼로그 열기/닫기
  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  // 리뷰 삭제 처리
  const handleDeleteReview = async () => {
    if (!reviewId) return;

    try {
      await deleteReview(reviewId as string);
      router.push('/sight/reviews');
    } catch (err) {
      console.error('리뷰 삭제 실패:', err);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  // 수정 페이지로 이동
  const handleEditReview = () => {
    router.push(`/sight/reviews/edit/${reviewId}`);
  };

  // 리뷰 목록으로 돌아가기
  const handleBackToList = () => {
    router.push('/sight/reviews');
  };

  // 리뷰 작성 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>리뷰 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={`${styles.paper} ${styles.error}`}>
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={handleBackToList}
          >
            <span className={styles.icon}>←</span>
            리뷰 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className={styles.container}>
        <div className={styles.paper}>
          <h2>리뷰 정보를 찾을 수 없습니다</h2>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={handleBackToList}
          >
            <span className={styles.icon}>←</span>
            리뷰 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 각 등급별 옵션 가져오기
  const artistGradeOption = getGradeOption(
    review.artistGrade,
    ARTIST_GRADE_OPTIONS
  );
  const stageGradeOption = getGradeOption(
    review.stageGrade,
    STAGE_GRADE_OPTIONS
  );
  const screenGradeOption = getGradeOption(
    review.screenGrade,
    SCREEN_GRADE_OPTIONS
  );

  return (
    <div className={styles.container}>
      {/* 공연 정보 헤더 */}
      <div className={styles.paper}>
        <div className={styles.header}>
          <div className={styles.icon}>{/* 공연 아이콘 */}</div>
          <div className={styles.concertInfo}>
            <p className={styles.arenaName}>{review.arenaName}</p>
            <h1 className={styles.concertName}>{review.concertName}</h1>
          </div>
        </div>

        {/* 좌석 정보 */}
        <h2 className={styles.seatInfo}>
          {review.section}구역 {review.rowLine}열 {review.columnLine}번
        </h2>
      </div>

      {/* 등급 평가 */}
      <div className={styles.gradeGrid}>
        <div className={styles.gradeItem}>
          <span
            className={styles.chip}
            style={{ backgroundColor: artistGradeOption.color }}
          >
            {artistGradeOption.label}
          </span>
          <span className={styles.gradeLabel}>아티스트 시야</span>
        </div>
        <div className={styles.gradeItem}>
          <span
            className={styles.chip}
            style={{ backgroundColor: stageGradeOption.color }}
          >
            {stageGradeOption.label}
          </span>
          <span className={styles.gradeLabel}>무대 시야</span>
        </div>
        <div className={styles.gradeItem}>
          <span
            className={styles.chip}
            style={{ backgroundColor: screenGradeOption.color }}
          >
            {screenGradeOption.label}
          </span>
          <span className={styles.gradeLabel}>스크린 시야</span>
        </div>
      </div>

      {/* 리뷰 내용 */}
      <div className={styles.paper}>
        <div className={styles.userInfo}>
          <div className={styles.user}>
            <div className={styles.avatar}></div>
            <span className={styles.nickname}>{review.nickname}</span>
          </div>
          <span className={styles.date}>{formatDate(review.createdAt)}</span>
        </div>

        <p className={styles.content}>{review.content}</p>

        {(review.cameraBrand || review.cameraModel) && (
          <div className={styles.cameraInfo}>
            <span className={styles.label}>촬영 장비:</span>
            <span>
              {review.cameraBrand} {review.cameraModel}
            </span>
          </div>
        )}
      </div>

      {/* 현장 사진 */}
      {review.photoUrls && review.photoUrls.length > 0 && (
        <div className={styles.paper}>
          <h3>현장 사진</h3>
          <div className={styles.photoGrid}>
            {review.photoUrls.map((photoUrl, index) => (
              <div className={styles.photoItem} key={index}>
                <img src={photoUrl} alt={`리뷰 이미지 ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={handleEditReview}
        >
          <span className={styles.icon}>✏️</span>
          수정하기
        </button>
        <button
          className={`${styles.button} ${styles.error}`}
          onClick={handleOpenDeleteDialog}
        >
          <span className={styles.icon}>🗑️</span>
          삭제하기
        </button>
        <button
          className={`${styles.button} ${styles.outlined}`}
          onClick={handleBackToList}
        >
          다른 리뷰 보기
        </button>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      {openDeleteDialog && (
        <div className={styles.dialog}>
          <div className={styles.dialogContent}>
            <h2 className={styles.dialogTitle}>리뷰 삭제</h2>
            <p className={styles.dialogText}>
              이 리뷰를 정말 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.
            </p>
            <div className={styles.dialogActions}>
              <button
                className={`${styles.button} ${styles.outlined}`}
                onClick={handleCloseDeleteDialog}
              >
                취소
              </button>
              <button
                className={`${styles.button} ${styles.error}`}
                onClick={handleDeleteReview}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
