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
  const baseStyles =
    'flex w-full items-center justify-between rounded-full transition-colors';

  const variantStyles = {
    primary: 'bg-background-default text-gray-900 hover:bg-primary-sub1',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100',
  };

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
      <div className="flex items-center gap-2">
        {leftIcon && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
            {leftIcon}
          </span>
        )}
      </div>

      {/* 텍스트 영역 - 가운데 정렬 */}
      <div className="flex-1 text-center">{children}</div>

      {/* 오른쪽 화살표 아이콘 */}
      {showRightArrow && (
        <div className="flex items-center">
          <ChevronRightIcon className="h-4 w-4" />
        </div>
      )}
    </button>
  );
};

export default IconButton;
