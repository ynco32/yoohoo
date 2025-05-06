'use client';

import React from 'react';
import styles from './page.module.scss';
import TextTitle from '@/components/common/TextTitle/TextTitle';
import Dropdown from '@/components/common/Dropdown/Dropdown';
import NumberInput from '@/components/common/NumberInput/NumberInput';
import ImageUpload from '@/components/sight/ImageUpload/ImageUpload';
import { ReviewSelect } from '@/components/sight/ReviewSelect/ReviewSelect';
import Button from '@/components/common/Button/Button';
import { useReviewForm } from '@/hooks/useReviewForm';
import {
  CAMERA_BRANDS,
  CAMERA_MODELS,
  ARTIST_GRADE_OPTIONS,
  SCREEN_GRADE_OPTIONS,
  STAGE_GRADE_OPTIONS,
} from '@/lib/constants';

export default function WriteReviewPage() {
  const {
    reviewData,
    imageFiles,
    selectedBrand,
    availableModels,
    isLoading,
    error,
    submitSuccess,
    handleChange,
    handleBrandChange,
    handleImageChange,
    handleSubmit,
    isFormValid,
  } = useReviewForm();

  return (
    <div className={styles.container}>
      <div className={styles.header}>좌석의 후기를 남겨보세요</div>

      {/* 성공 메시지 */}
      {submitSuccess && (
        <div className={styles.successMessage}>
          리뷰가 성공적으로 등록되었습니다!
        </div>
      )}

      {/* 에러 메시지 */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.form}>
        <div className={styles.seatInfo}>
          {/* 좌석 정보 */}
          <TextTitle title='좌석 정보' help='열과 번이 무엇인가요?' />
          <Dropdown
            options={[]}
            placeholder='다녀온 콘서트를 선택해주세요'
            onChange={(value) => handleChange('concertId', value)}
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
              value={reviewData.rowLine}
              onChange={(value) => handleChange('rowLine', value)}
            />
            <NumberInput
              label='번'
              value={reviewData.columnLine}
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
            disabled={!isFormValid() || isLoading}
            fontSize={18}
            padding='12px 0'
          >
            {isLoading ? '제출 중...' : '완료'}
          </Button>
        </div>
      </div>
    </div>
  );
}
