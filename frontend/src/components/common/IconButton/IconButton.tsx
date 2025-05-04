import React, { CSSProperties } from 'react';
import styles from './IconButton.module.scss';
import IconBox, { IconName } from '../IconBox/IconBox';

interface IconButtonProps {
  /**
   * 아이콘 이름 (IconBox 컴포넌트에서 지원하는 모든 아이콘)
   */
  icon: IconName;

  /**
   * 클릭 이벤트 핸들러
   */
  onClick?: () => void;

  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * 아이콘 크기
   */
  iconSize?: number;

  /**
   * 직접 스타일 지정
   */
  style?: CSSProperties;
}

/**
 * 원형 아이콘 버튼 컴포넌트
 */
export default function IconButton({
  icon,
  onClick,
  className = '',
  iconSize = 20,
  style,
  ...props
}: IconButtonProps) {
  return (
    <button
      type='button'
      className={`${styles.iconButton} ${className}`}
      onClick={onClick}
      style={style}
      {...props}
    >
      <IconBox name={icon} size={iconSize} color='white' />
    </button>
  );
}

export type { IconButtonProps };
