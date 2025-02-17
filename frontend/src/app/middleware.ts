// [Next.js] src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const ticketingPaths = [
    '/ticketing/melon-mode/real/areaSelect',
    '/ticketing/melon-mode/real/[areaType]',
    '/ticketing/melon-mode/real/payment1',
    '/ticketing/melon-mode/real/payment2',
    '/ticketing/melon-mode/real/result',
  ];

  if (ticketingPaths.some((path) => request.nextUrl.pathname.includes(path))) {
    // Next.js 15에서는 headers() 메서드 사용
    const referer = request.headers.get('referer');

    // referer가 없다면 (= URL 직접 입력했다면)
    if (!referer) {
      // Next.js 15에서는 Response.redirect() 사용 권장
      // 메인 페이지로 강제 이동
      return Response.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/ticketing/melon-mode/real/:path*'],
};
