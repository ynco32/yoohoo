// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const progress = parseInt(
      req.cookies.get('ticketing-progress')?.value || '1'
    );

    // src/middleware.ts
    type StepPaths = {
      '/ticketing/melon-mode/real': number;
      '/ticketing/melon-mode/real/areaSelect': number;
      '/ticketing/melon-mode/real/[areaType]': number;
      '/ticketing/melon-mode/real/payment1': number;
      '/ticketing/melon-mode/real/payment1/payment2': number;
    };

    const steps: StepPaths = {
      '/ticketing/melon-mode/real': 1,
      '/ticketing/melon-mode/real/areaSelect': 2,
      '/ticketing/melon-mode/real/[areaType]': 3,
      '/ticketing/melon-mode/real/payment1': 4,
      '/ticketing/melon-mode/real/payment1/payment2': 5,
    };

    const currentStep = steps[path as keyof StepPaths];
    if (currentStep > progress) {
      return NextResponse.redirect(new URL('/ticketing/select', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req }) => !!req.cookies.get('ticketing-progress'),
    },
  }
);

export const config = {
  matcher: ['/ticketing/:path*'],
};
