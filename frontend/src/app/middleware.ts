// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const referer = request.headers.get('referer');

  if (!referer) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/ticketing/melon-mode/real/areaSelect',
    '/ticketing/melon-mode/real/[areaType]',
    '/ticketing/melon-mode/real/payment1',
    '/ticketing/melon-mode/real/payment1/payment2',
    '/ticketing/melon-mode/real/result',
  ],
};
