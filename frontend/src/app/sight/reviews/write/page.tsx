'use client';

import styles from './page.module.scss';
import TextTitle from '@/components/common/TextTitle/TextTitle';
import Dropdown from '@/components/common/Dropdown/Dropdown';

export default function WriteReviewPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>좌석의 후기를 남겨보세요</div>
      <div className={styles.form}>
        <div className={styles.seatInfo}>
          {/* 좌석 정보 */}
          <TextTitle title='좌석 정보' help='열과 번이 무엇인가요?' />
          <Dropdown options={[]} placeholder='다녀온 콘서트를 선택해주세요' />
          {/* <input
            type='number'
            value={value?.toString() || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue === '' || parseInt(newValue) >= 0) {
                onChange?.(newValue);
              }
            }}
            placeholder=''
            min={0}
            className='w-20 rounded-md bg-primary-50 p-2 text-center focus:outline-none focus:ring-2 focus:ring-primary-main'
          /> */}
        </div>
        <div className={styles.image}>
          {/* 이미지 업로드 */}
          <TextTitle
            title='이미지 업로드'
            description='최대 3장까지 업로드 가능해요!'
          />
        </div>
        <div className={styles.sightReview}>
          {/* 시야 후기 */}
          <TextTitle
            title='시야 후기'
            description='자리에서 아티스트가 잘 보였나요?'
          />
          <TextTitle description='자리에서 스크린이 잘 보였나요?' />
          <TextTitle description='자리에서 무대가 잘 보였나요?' />
        </div>
        <div className={styles.content}>
          {' '}
          <TextTitle
            title='상세후기'
            description='더 자세한 좌석 후기를 남겨주세요!'
          />
          {/* 상세 후기 */}
        </div>
        <div className={styles.camera}>
          {/* 촬영 기종 */}
          <TextTitle
            title='촬영기종'
            description='시야 사진을 촬영한 핸드폰 기종을 알려주세요'
          />
        </div>
      </div>
    </div>
  );
}
