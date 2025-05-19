// app/sight/reviews/edit/[reviewId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // next/navigation 사용
import { useParams } from 'next/navigation'; // 파라미터용
import styles from './page.module.scss';
import TextTitle from '@/components/common/TextTitle/TextTitle';
import Dropdown from '@/components/common/Dropdown/Dropdown';
import NumberInput from '@/components/common/NumberInput/NumberInput';
import ImageUpload from '@/components/sight/ImageUpload/ImageUpload';
import { ReviewSelect } from '@/components/sight/ReviewSelect/ReviewSelect';
import Button from '@/components/common/Button/Button';
import { useReviewEditForm } from '@/hooks/useReviewEditForm';
import TextInput from '@/components/common/TextInput/TextInput';
import { useSearchConcerts } from '@/hooks/useSearchConcert';
import { concert } from '@/types/concert';
import { apiRequest } from '@/api/api'; // API 클라이언트 추가
import {
  CAMERA_BRANDS,
  CAMERA_MODELS,
  ARTIST_GRADE_OPTIONS,
  SCREEN_GRADE_OPTIONS,
  STAGE_GRADE_OPTIONS,
} from '@/lib/constants';

export default function EditReviewPage() {
  // App Router와 호환되는 방식으로 라우터와 파라미터 사용
  const router = useRouter();
  const params = useParams<{ reviewId: string }>();
  const reviewId = params?.reviewId;
  const [isLoading, setIsLoading] = useState(true);
  const [initialConcert, setInitialConcert] = useState<concert | null>(null);

  // 콘서트 검색 훅 추가
  const {
    concerts,
    isLoading: isSearching,
    error: searchError,
    searchWord,
    setSearchWord,
  } = useSearchConcerts();

  // 선택된 콘서트 상태 추가
  const [selectedConcert, setSelectedConcert] = useState<concert | null>(null);

  const {
    reviewData,
    imageFiles,
    existingImages,
    selectedBrand,
    availableModels,
    isFormSubmitting,
    error,
    submitSuccess,
    handleChange,
    handleBrandChange,
    handleImageChange: originalHandleImageChange,
    handleRemoveExistingImage,
    handleSubmit,
    isFormValid,
  } = useReviewEditForm(reviewId || '');

  // 기존 콘서트 정보 가져오기
  useEffect(() => {
    const fetchConcertInfo = async () => {
      if (reviewId && reviewData.concertId) {
        try {
          // concertId를 사용하여 콘서트 정보 가져오기
          const concert = await apiRequest<concert>(
            'GET',
            `/api/concerts/${reviewData.concertId}`
          );

          if (concert) {
            setInitialConcert(concert);
            // 초기 검색어를 콘서트 이름이나 아티스트로 설정
            setSearchWord('');
          }
        } catch (err) {
          console.error('콘서트 정보를 가져오는 데 실패했습니다:', err);
        }
      }
      setIsLoading(false);
    };

    if (reviewData.concertId) {
      fetchConcertInfo();
    } else if (reviewId) {
      setIsLoading(false);
    } else {
      router.push('/sight/reviews');
    }
  }, [reviewId, reviewData.concertId, router]);

  // 콘서트 옵션 생성 - 초기 콘서트를 포함
  const concertOptions = React.useMemo(() => {
    const options = concerts.map((concert) => ({
      value: concert.concertId.toString(),
      label: concert.concertName,
    }));

    // 초기 콘서트가 있고 아직 옵션에 없다면 추가
    if (
      initialConcert &&
      !options.some(
        (option) => option.value === initialConcert.concertId.toString()
      )
    ) {
      options.unshift({
        value: initialConcert.concertId.toString(),
        label: initialConcert.concertName,
      });
    }

    return options;
  }, [concerts, initialConcert]);

  // 콘서트 선택 핸들러 함수 추가
  const handleConcertSelect = (value: string) => {
    handleChange('concertId', parseInt(value, 10));

    // 선택된 콘서트 정보 업데이트
    const selected =
      concerts.find((concert) => concert.concertId.toString() === value) ||
      initialConcert;

    setSelectedConcert(selected);
  };

  // ImageUpload 컴포넌트의 onChange 타입에 맞게 핸들러 래핑
  const handleImageChange = (files: (File | string)[] | null) => {
    if (files) {
      // File 타입만 필터링
      const fileObjects = files.filter(
        (file) => file instanceof File
      ) as File[];
      originalHandleImageChange(fileObjects);
    } else {
      originalHandleImageChange([]);
    }
  };

  // 로딩 표시
  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => router.push(`/sight/reviews/${reviewId}`)}
        >
          <span className={styles.icon}>←</span>
          취소
        </button>
        <h1 className={styles.title}>리뷰 수정</h1>
      </div>

      {/* 성공 메시지 */}
      {submitSuccess && (
        <div className={styles.successMessage}>
          리뷰가 성공적으로 수정되었습니다!
        </div>
      )}

      {/* 에러 메시지 */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {searchError && <div className={styles.errorMessage}>{searchError}</div>}

      <div className={styles.form}>
        <div className={styles.seatInfo}>
          {/* 좌석 정보 */}
          <TextTitle title='좌석 정보' help='열과 번이 무엇인가요?' />
          <TextInput
            className={styles.concertSearch}
            value={searchWord}
            onChange={(value: string) => setSearchWord(value)}
            placeholder='가수명으로 콘서트 검색하기'
          />

          {/* 항상 드롭다운 표시 - 초기 콘서트가 있으면 그 정보로 시작 */}
          <Dropdown
            options={concertOptions}
            placeholder='다녀온 콘서트를 선택해주세요'
            onChange={handleConcertSelect}
            disabled={isSearching}
            value={reviewData.concertId ? reviewData.concertId.toString() : ''}
          />

          <div className={styles.seatValue}>
            {/* 기본 input 태그로 구역 구현 */}
            <div className={styles.numberInputContainer}>
              <input
                type='text'
                value={reviewData.section || ''}
                onChange={(e) => handleChange('section', e.target.value)}
                className={styles.numberInput}
              />
              <span className={styles.label}>구역</span>
            </div>
            <NumberInput
              label='열'
              value={reviewData.rowLine ? Number(reviewData.rowLine) : 0}
              onChange={(value) => handleChange('rowLine', String(value))}
            />
            <NumberInput
              label='번'
              value={reviewData.columnLine || 0}
              onChange={(value) => handleChange('columnLine', value)}
            />
          </div>
        </div>

        <div className={styles.image}>
          {/* 이미지 업로드 */}
          <TextTitle
            title='이미지 업로드'
            description='최대 3장까지 업로드 가능해요!'
          />

          {/* 기존 이미지 표시 */}
          {existingImages && existingImages.length > 0 && (
            <div className={styles.existingImages}>
              <h3 className={styles.subTitle}>기존 이미지</h3>
              <div className={styles.imageGrid}>
                {existingImages.map((url, index) => (
                  <div className={styles.imageItem} key={index}>
                    <img
                      src={url}
                      alt={`리뷰 이미지 ${index + 1}`}
                      className={styles.image}
                    />
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemoveExistingImage(url)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 새 이미지 업로드 - 래핑된 핸들러 사용 */}
          <ImageUpload
            value={imageFiles.length > 0 ? imageFiles : null}
            onChange={handleImageChange}
          />
        </div>

        <div className={styles.sightReview}>
          {/* 시야 후기 */}
          <TextTitle
            title='시야 후기'
            description='자리에서 아티스트가 잘 보였나요?'
          />
          <ReviewSelect
            options={ARTIST_GRADE_OPTIONS}
            value={reviewData.artistGrade}
            onChange={(value) => handleChange('artistGrade', value)}
          />

          <TextTitle description='자리에서 스크린이 잘 보였나요?' />
          <ReviewSelect
            options={SCREEN_GRADE_OPTIONS}
            value={reviewData.screenGrade}
            onChange={(value) => handleChange('screenGrade', value)}
          />

          <TextTitle description='자리에서 무대가 잘 보였나요?' />
          <ReviewSelect
            options={STAGE_GRADE_OPTIONS}
            value={reviewData.stageGrade}
            onChange={(value) => handleChange('stageGrade', value)}
          />
        </div>

        <div className={styles.content}>
          <TextTitle
            title='상세후기'
            description='더 자세한 좌석 후기를 남겨주세요!'
          />
          <div className={styles.textareaWrapper}>
            <textarea
              value={reviewData.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder='시야 후기를 남겨주세요!'
              maxLength={200}
            />
            <div className={styles.counter}>
              {(reviewData.content || '').length}/200
            </div>
          </div>
        </div>

        <div className={styles.camera}>
          {/* 촬영 기종 */}
          <TextTitle
            title='촬영기종'
            description='시야 사진을 촬영한 핸드폰 기종을 알려주세요'
          />
          <div className={styles.cameraFields}>
            <Dropdown
              options={CAMERA_BRANDS}
              value={selectedBrand}
              onChange={handleBrandChange}
              placeholder='브랜드'
              className={styles.cameraBrand}
            />
            <Dropdown
              options={availableModels}
              value={reviewData.cameraModel}
              onChange={(value) => handleChange('cameraModel', value)}
              placeholder='기종'
              className={styles.cameraModel}
              disabled={!selectedBrand}
            />
          </div>

          {/* 버튼 컴포넌트 */}
          <Button
            variant='primary'
            onClick={handleSubmit}
            disabled={!isFormValid() || isFormSubmitting}
            fontSize={18}
            padding='12px 0'
          >
            {isFormSubmitting ? '수정 중...' : '수정 완료'}
          </Button>
        </div>
      </div>
    </div>
  );
}
