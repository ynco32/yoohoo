import { ButtonHTMLAttributes } from 'react';
import { ReactNode } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: ReactNode;
  children: ReactNode;
  showRightArrow?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = ({
  leftIcon,
  children,
  showRightArrow = true,
  variant = 'primary',
  size = 'md',
  ...props
}: IconButtonProps) => {
  // 버튼 기본 스타일
  const baseStyles = 'flex items-center gap-2 rounded-full transition-colors';

  // variant별 스타일 매핑
  const variantStyles = {
    primary: 'bg-background-default text-gray-900 hover:bg-primary-sub1',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100',
  };

  // size별 스타일 매핑
  const sizeStyles = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-5 py-2.5',
    lg: 'text-lg px-6 py-3',
  };
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
      {...props}
    >
      {/* 왼쪽 아이콘 영역 */}
      {leftIcon && (
        // JSX 에서  JavaScript 삽입 {}
        // 조건부 렌더링
        // leftIcon이 있으면 괄호 안의 내용을 렌더링
        // leftIcon이 없으면 아무것도 렌더링하지 않음
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          {leftIcon}
        </span>
      )}

      {/* 텍스트 영역 */}
      <span>{children}</span>

      {/* 오른쪽 화살표 아이콘 */}
      {showRightArrow && <ChevronRightIcon className="h-4 w-4" />}
    </button>
  );
};

export default IconButton;
