import React, { ReactNode } from 'react';
import styles from './TextTitle.module.scss';

interface TextTitleProps {
  /**
   * 제목 텍스트
   */
  title: string;

  /**
   * 부제목 또는 설명 텍스트
   */
  description?: string;

  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * 제목 크기 (large, medium, small)
   */
  size?: 'large' | 'medium' | 'small';

  /**
   * 가운데 정렬 여부
   */
  centered?: boolean;

  /**
   * 추가적인 컨텐츠나 버튼 등을 추가할 수 있는 children
   */
  children?: ReactNode;
}

/**
 * 타이틀과 설명 텍스트를 표시하는 컴포넌트
 */
export default function TextTitle({
  title,
  description,
  className = '',
  size = 'medium',
  centered = false,
  children,
}: TextTitleProps) {
  return (
    <div
      className={`${styles.titleContainer} ${styles[size]} ${
        centered ? styles.centered : ''
      } ${className}`}
    >
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
