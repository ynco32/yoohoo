'use client';

import {
  GiftIcon,
  DocumentTextIcon,
  TicketIcon,
  ExclamationCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { MyMenuItem } from './MyMenuItem';

const myMenuItems = [
  {
    icon: DocumentTextIcon,
    label: '내 리뷰',
    layout: 'narrow' as const,
    href: '/mypage/sight',
  },
  {
    icon: GiftIcon,
    label: '내 나눔',
    layout: 'default' as const,
    href: '/mypage/sharing',
  },
  {
    icon: TicketIcon,
    label: '티켓팅 기록',
    layout: 'default' as const,
    href: '/mypage/ticketing',
  },
  {
    icon: ArrowRightStartOnRectangleIcon,
    label: '로그아웃',
    href: '/logout',
    layout: 'wide' as const,
    className: '',
  },
  {
    icon: ExclamationCircleIcon,
    label: '회원 탈퇴',
    href: '/deactivate',
    layout: 'wide' as const,
    className: '',
  },
];

export default function myMenu() {
  return (
    <div className="flex-1 py-4">
      <div className="grid h-full w-full grid-cols-3 gap-x-md gap-y-sm">
        {myMenuItems.map((item) => (
          <MyMenuItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            layout={item.layout}
            href={item.href}
            className={item.className}
          />
        ))}
      </div>
    </div>
  );
}
