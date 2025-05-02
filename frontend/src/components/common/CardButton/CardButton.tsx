import Image from 'next/image';
import { useRouter } from 'next/router';
import ClosedLockIcon from '@/assets/icons/locked.svg';
import styles from './CardButton.module.scss';

interface CardButtonProps {
  href?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label?: string;
  title?: string; // 타이틀 추가
  isDisabled?: boolean;
  className?: string;
  imgSrc?: string;
  imgAlt?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large' | number;
}

const CardButton: React.FC<CardButtonProps> = ({
  href,
  icon: Icon,
  label,
  title, // 타이틀 추가
  isDisabled = false,
  className = '',
  imgSrc,
  imgAlt,
  onClick,
  size = 'medium',
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (isDisabled) return;

    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  // 크기에 따른 스타일 클래스 결정
  let sizeClass = '';
  if (typeof size === 'string') {
    sizeClass = styles[size];
  }

  // 이미지나 아이콘 크기 계산 (버튼 크기의 비율에 따라)
  const getContentSize = () => {
    if (typeof size === 'number') {
      return {
        width: `${size * 0.7}px`, // 버튼 크기의 70%
        height: `${size * 0.7}px`,
      };
    }
    return {};
  };

  const contentSize = getContentSize();

  return (
    <div className={styles.container}>
      <div
        onClick={handleClick}
        className={`${styles.cardButton} ${sizeClass} ${
          isDisabled ? styles.disabled : ''
        } ${className}`}
        style={
          typeof size === 'number'
            ? { width: `${size}px`, height: `${size}px` }
            : {}
        }
      >
        <div className={styles.contentWrapper}>
          {imgSrc ? (
            <div className={styles.imageContainer} style={contentSize}>
              <Image
                src={imgSrc}
                alt={imgAlt || '이미지'}
                fill
                className={styles.image}
              />
            </div>
          ) : isDisabled ? (
            <ClosedLockIcon className={styles.lockIcon} style={contentSize} />
          ) : Icon ? (
            <Icon className={styles.icon} style={contentSize} />
          ) : null}

          {label && (
            <span
              className={`${styles.label} ${
                isDisabled ? styles.labelDisabled : ''
              }`}
            >
              {label}
            </span>
          )}
        </div>
      </div>
      {title && <h3 className={styles.title}>{title}</h3>}
    </div>
  );
};

export default CardButton;
