'use client';
// app/(auth)/ticketing/melon-mode/real/page.tsx
import dynamic from 'next/dynamic';

const Ticketing1 = dynamic(() => import('./Ticketing1'), { ssr: false });

export default function Page() {
  return <Ticketing1 />;
}
