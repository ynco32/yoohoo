interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const TextButton = ({
  variant = 'primary',
  isLoading = false,
  loadingText,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'w-full rounded-lg py-4 transition-colors';

  const variantStyles = {
    primary: 'bg-primary-main text-white disabled:bg-gray-300',
    outline:
      'border border-primary-main text-primary-main disabled:border-gray-300 disabled:text-gray-300',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? loadingText || '로딩 중...' : children}
    </button>
  );
};
