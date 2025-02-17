'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TicketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 티켓팅 관련 페이지들만 체크
    const ticketingPaths = [
      '/ticketing/melon-mode/real/areaSelect',
      '/ticketing/melon-mode/real/payment1',
      '/ticketing/melon-mode/real/payment1/payment2',
      '/ticketing/melon-mode/real/result',
    ];

    // 현재 경로가 티켓팅 페이지이고 referer가 없는 경우에만 리다이렉트
    if (ticketingPaths.includes(pathname) && !document.referrer) {
      router.push('/main');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
// 'use client';
// // src/app/(auth)/ticketing/layout.tsx
// import { usePathname, useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export default function TicketingLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   useEffect(() => {
//     // 티켓팅 관련 경로들
//     const ticketingPaths = [
//       '/ticketing/melon-mode/real/areaSelect',
//       '/ticketing/melon-mode/real/[areaType]',
//       '/ticketing/melon-mode/real/payment1',
//       '/ticketing/melon-mode/real/payment1/payment2',
//       '/ticketing/melon-mode/real/result',
//     ];

//     // 현재 경로가 티켓팅 관련 경로인지 확인
//     if (ticketingPaths.includes(pathname)) {
//       // 여기서 세션스토리지나 상태를 확인해서
//       // 정상적인 플로우로 왔는지 체크할 수 있습니다
//       const isValidFlow = sessionStorage.getItem('ticketingFlow');

//       if (!isValidFlow) {
//         // 비정상 접근시 홈으로 리다이렉트
//         router.push('/main');
//       }
//     }
//   }, [pathname, router]);

//   return <>{children}</>;
// }
