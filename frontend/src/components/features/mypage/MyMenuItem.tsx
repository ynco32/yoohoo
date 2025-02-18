import React from 'react';
import { useRouter } from 'next/navigation';
import type { ComponentType, SVGProps } from 'react';
import logout from '@/lib/api/logout';

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

  const isLogout = label === '로그아웃';
  const isWithdrawal = label === '회원 탈퇴';
  const textColorClass = isWithdrawal
    ? 'text-status-warning'
    : layoutClassesText[layout];

  const handleClick = async () => {
    if (isLogout) {
      try {
        await logout();
        // 로그아웃 성공 시 로그인 페이지로 이동
        router.push('/login');
      } catch (error) {
        console.error('로그아웃 실패:', error);
        // 에러 처리 (필요한 경우 토스트 메시지 등 추가)
      }
    } else {
      router.push(href);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex cursor-pointer flex-col justify-between rounded-card bg-background-default p-md shadow-my-page transition-all duration-normal ${layoutClasses[layout]} ${className}`}
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
