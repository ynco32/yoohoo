// src/components/ui/EmptyState.tsx
import { XCircleIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  message?: string;
  className?: string;
}

const EmptyState = ({
  message = '기록이 없습니다.',
  className = '',
}: EmptyStateProps) => {
  return (
    <div
      className={`flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 ${className}`}
    >
      <XCircleIcon className="h-12 w-12 text-gray-300" />
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;
