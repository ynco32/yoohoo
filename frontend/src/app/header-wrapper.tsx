'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layouts/Header/Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const pagesWithoutHeader = ['/', '/login'];
  const hasHeader = !pagesWithoutHeader.includes(pathname);

  return <>{hasHeader && <Header />}</>;
}
