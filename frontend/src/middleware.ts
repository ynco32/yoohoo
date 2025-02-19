// src/middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

type StepPaths = {
  '/ticketing/melon-mode/real': number;
  '/ticketing/melon-mode/real/areaSelect': number;
  '/ticketing/melon-mode/real/[areaType]': number;
  '/ticketing/melon-mode/real/payment1': number;
  '/ticketing/melon-mode/real/payment1/payment2': number;
  '/ticketing/melon-mode/real/result': 6;
};

const steps: StepPaths = {
  '/ticketing/melon-mode/real': 1,
  '/ticketing/melon-mode/real/areaSelect': 2,
  '/ticketing/melon-mode/real/[areaType]': 3,
  '/ticketing/melon-mode/real/payment1': 4,
  '/ticketing/melon-mode/real/payment1/payment2': 5,
  '/ticketing/melon-mode/real/result': 6,
};

export default withAuth(
  function middleware(req) {
    let path = req.nextUrl.pathname;
    const progress = parseInt(
      req.cookies.get('ticketing-progress')?.value || '1'
    );

    if (
      path.includes('/ticketing/melon-mode/real/') &&
      path.split('/').length === 5
    ) {
      path = '/ticketing/melon-mode/real/[areaType]';
    }

    const currentStep = steps[path as keyof StepPaths];
    if (currentStep > progress) {
      return NextResponse.redirect(
        new URL('/ticketing/melon-mode/real', req.url)
      );
    }
  },
  {
    callbacks: {
      authorized: ({ req }) => {
        if (req.nextUrl.pathname === '/ticketing/melon-mode/real') {
          return true;
        }
        return true;
      },
    },
    pages: {
      signIn: '/main',
      error: '/main',
    },
  }
);

export const config = {
  matcher: ['/ticketing/melon-mode/real', '/ticketing/melon-mode/real/:path*'],
};
