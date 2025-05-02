import React, { CSSProperties } from 'react';
import Image from 'next/image';
import styles from './ArenaCard.module.scss';

interface ArenaCardProps {
  /**
   * 경기장 이름
   */
  name: string;

  /**
   * 경기장 영문 이름
   */
  englishName: string;

  /**
   * 경기장 주소
   */
  address: string;

  /**
   * 경기장 이미지 URL (없을 경우 더미 이미지 사용)
   */
  imageUrl?: string;

  /**
   * 클릭 이벤트 핸들러
   */
  onClick?: () => void;

  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * 카드 너비 (숫자 또는 문자열, 예: 500, '500px', '100%')
   */
  width?: number | string;

  /**
   * 이미지 크기 (숫자 또는 문자열, 예: 110, '110px')
   */
  imageSize?: number | string;

  /**
   * 추가 스타일
   */
  style?: CSSProperties;
}

/**
 * 경기장 정보를 표시하는 카드 컴포넌트
 */
export default function ArenaCard({
  name,
  englishName,
  address,
  imageUrl,
  onClick,
  className = '',
  width,
  imageSize,
  style,
}: ArenaCardProps) {
  // 더미 이미지 URL
  const dummyImageUrl = '/images/dummyArena.jpg';

  // 카드 너비 설정
  const cardWidth = width
    ? typeof width === 'number'
      ? `${width}px`
      : width
    : undefined;

  // 이미지 크기 설정
  const imgSize = imageSize
    ? typeof imageSize === 'number'
      ? `${imageSize}px`
      : imageSize
    : '80px'; // 기본값

  return (
    <div
      className={`${styles.card} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        ...style,
        width: cardWidth,
      }}
    >
      <div
        className={styles.imageContainer}
        style={{
          width: imgSize,
          height: imgSize,
        }}
      >
        <Image
          src={imageUrl || dummyImageUrl}
          alt={`${name} 경기장 이미지`}
          className={styles.image}
          fill
          sizes={`(max-width: 430px) 100%, ${imgSize}`}
        />
      </div>
      <div className={styles.content} style={{ height: imgSize }}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.englishName}>{englishName}</p>
        </div>
        <p className={styles.address}>{address}</p>
      </div>
    </div>
  );
}
