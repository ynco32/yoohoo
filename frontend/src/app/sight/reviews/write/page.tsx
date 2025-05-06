'use client';

import { useState, useMemo } from 'react';
import styles from './page.module.scss';
import TextTitle from '@/components/common/TextTitle/TextTitle';
import Dropdown from '@/components/common/Dropdown/Dropdown';
import NumberInput from '@/components/common/NumberInput/NumberInput';
import ImageUpload from '@/components/sight/ImageUpload/ImageUpload';
import { ReviewSelect } from '@/components/sight/ReviewSelect/ReviewSelect';
import Button from '@/components/common/Button/Button';
import {
  ReviewRequestDTO,
  ArtistGrade,
  StageGrade,
  ScreenGrade,
  ARTIST_GRADE_OPTIONS,
  SCREEN_GRADE_OPTIONS,
  STAGE_GRADE_OPTIONS,
} from '@/types/review';
import { useReview } from '@/hooks/useReview';
import { useRouter } from 'next/navigation';

// 카메라 브랜드 및 기종 데이터
const CAMERA_BRANDS = [
  { label: '삼성', value: '삼성' },
  { label: '애플', value: '애플' },
];

// 브랜드별 기종 데이터
const CAMERA_MODELS: Record<string, { label: string; value: string }[]> = {
  삼성: [
    { label: '갤럭시 S24 Ultra', value: '갤럭시 S24 Ultra' },
    { label: '갤럭시 S24', value: '갤럭시 S24' },
    { label: '갤럭시 S23', value: '갤럭시 S23' },
    { label: '갤럭시 노트 20', value: '갤럭시 노트 20' },
    { label: '갤럭시 Z 플립', value: '갤럭시 Z 플립' },
    { label: '갤럭시 Z 폴드', value: '갤럭시 Z 폴드' },
  ],
  애플: [
    { label: 'iPhone 16 Pro Max', value: 'iPhone 16 Pro Max' },
    { label: 'iPhone 16 Pro', value: 'iPhone 16 Pro' },
    { label: 'iPhone 16', value: 'iPhone 16' },
    { label: 'iPhone 15 Pro Max', value: 'iPhone 15 Pro Max' },
    { label: 'iPhone 15 Pro', value: 'iPhone 15 Pro' },
    { label: 'iPhone 15', value: 'iPhone 15' },
    { label: 'iPhone 14', value: 'iPhone 14' },
  ],
};

export default function WriteReviewPage() {
  const router = useRouter();
  const { createReview, isLoading, error } = useReview();

  // 리뷰 데이터 상태 관리
  const [reviewData, setReviewData] = useState<Partial<ReviewRequestDTO>>({
    content: '',
  });

  // 이미지 파일 상태 관리
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // 카메라 브랜드 상태
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    undefined
  );

  // 제출 성공 상태
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 선택된 브랜드에 따라 사용 가능한 모델 목록 결정
  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    return CAMERA_MODELS[selectedBrand] || [];
  }, [selectedBrand]);

  // 값 변경 핸들러
  const handleChange = (key: keyof ReviewRequestDTO, value: any) => {
    setReviewData((prev) => ({ ...prev, [key]: value }));
  };

  // 브랜드 변경 핸들러
  const handleBrandChange = (brandValue: string) => {
    setSelectedBrand(brandValue);
    // 브랜드가 변경되면 기존에 선택한 기종 초기화
    setReviewData((prev) => ({
      ...prev,
      cameraBrand: brandValue,
      cameraModel: undefined,
    }));
  };

  // 완료 버튼 클릭 핸들러 - API 연결
  const handleSubmit = async () => {
    if (!isFormValid()) return;

    try {
      // ReviewRequestDTO 타입에 맞게 데이터 변환
      const submitData: ReviewRequestDTO = {
        concertId: reviewData.concertId!,
        section: reviewData.section!, // 문자열
        rowLine: reviewData.rowLine!,
        columnLine: reviewData.columnLine!,
        artistGrade: reviewData.artistGrade!,
        stageGrade: reviewData.stageGrade!,
        screenGrade: reviewData.screenGrade!,
        content: reviewData.content!,
        cameraBrand: reviewData.cameraBrand,
        cameraModel: reviewData.cameraModel,
      };

      // API 호출
      const reviewId = await createReview(submitData, imageFiles);

      if (reviewId) {
        // 성공 처리
        setSubmitSuccess(true);
        setTimeout(() => {
          // 성공 후 페이지 이동
          router.push(`/reviews/${reviewId}`);
        }, 2000);
      }
    } catch (err) {
      console.error('리뷰 제출 오류:', err);
    }
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    // 필수 필드 검사
    const requiredFields = [
      reviewData.concertId !== undefined,
      reviewData.section !== undefined && reviewData.section.trim() !== '',
      reviewData.rowLine !== undefined && reviewData.rowLine > 0,
      reviewData.columnLine !== undefined && reviewData.columnLine > 0,
      reviewData.artistGrade !== undefined,
      reviewData.stageGrade !== undefined,
      reviewData.screenGrade !== undefined,
      reviewData.content !== undefined && reviewData.content.trim() !== '',
    ];

    return requiredFields.every((field) => field === true);
  };

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
            onChange={(files: (File | string)[] | null) => {
              if (files) {
                // File 타입만 추출
                const fileObjects = files.filter(
                  (file) => file instanceof File
                ) as File[];
                // 최대 3개로 제한
                const limitedFiles = fileObjects.slice(0, 3);
                setImageFiles(limitedFiles);
              } else {
                setImageFiles([]);
              }
            }}
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

          {/* 버튼 컴포넌트 사용 - 로딩 상태 추가 */}
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
