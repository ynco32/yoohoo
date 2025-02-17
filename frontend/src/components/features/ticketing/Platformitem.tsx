import React from 'react';
import { useRouter } from 'next/navigation';
import type { ComponentType, SVGProps } from 'react';
import { LockClosedIcon } from '@heroicons/react/16/solid';

interface PlatformItemProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
  platformId: number;
  className?: string;
}

export const PlatformItem = ({
  icon: Icon,
  label,
  href,
  platformId,
  className = '',
}: PlatformItemProps) => {
  const router = useRouter();
  const isDisabled = platformId !== 1;

  return (
    <div
      onClick={!isDisabled ? () => router.push(href) : undefined}
      className={`shadow-my-page group relative flex ${
        !isDisabled ? 'cursor-pointer' : 'cursor-not-allowed'
      } flex-col justify-between rounded-card ${
        isDisabled ? 'bg-gray-100' : 'bg-background-default'
      } p-md transition-all duration-normal ${className}`}
    >
      <div className="flex items-center">
        <div className={`flex w-full flex-col items-center gap-xs`}>
          <div className="relative">
            {isDisabled ? (
              <LockClosedIcon className="h-6 w-6 text-gray-400" />
            ) : (
              <Icon className="h-6 w-6" />
            )}
          </div>
          <span
            className={`text-center text-caption2 transition-all duration-normal group-hover:font-medium ${
              isDisabled ? 'text-gray-400' : ''
            }`}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlatformItem;
