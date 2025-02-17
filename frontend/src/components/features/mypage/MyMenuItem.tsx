import React from 'react';
import { useRouter } from 'next/navigation';
import type { ComponentType, SVGProps } from 'react';

interface MyMenuItemProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
  className?: string;
  layout: 'default' | 'wide' | 'narrow';
}

export const MyMenuItem = ({
  icon: Icon,
  label,
  href,
  className = '',
  layout = 'default',
}: MyMenuItemProps) => {
  const router = useRouter();

  const layoutClasses = {
    default: 'col-span-1',
    wide: 'col-span-3',
    narrow: 'col-span-1',
  };

  const layoutClassesText = {
    default: 'text-text-menu',
    wide: 'text-text-description',
    narrow: 'text-text-menu',
  };

  const isWithdrawal = label === '회원 탈퇴';
  const textColorClass = isWithdrawal
    ? 'text-status-warning'
    : layoutClassesText[layout];

  return (
    <div
      onClick={() => router.push(href)}
      className={`shadow-my-page group relative flex cursor-pointer flex-col justify-between rounded-card bg-background-default p-md transition-all duration-normal ${layoutClasses[layout]} ${className}`}
    >
      <div className="flex items-center">
        <div
          className={`flex w-full ${
            layout === 'wide'
              ? 'flex-row items-center gap-sm'
              : 'flex-col items-center gap-xs'
          }`}
        >
          <Icon className={`h-6 w-6 ${textColorClass}`} />
          <span
            className={`text-center text-caption2 ${textColorClass} transition-all duration-normal group-hover:font-medium`}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyMenuItem;
