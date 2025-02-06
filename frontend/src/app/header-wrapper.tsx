'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layouts/Header/Header';

export default function HeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pagesWithoutHeader = ['/', '/login'];
  const hasHeader = !pagesWithoutHeader.includes(pathname);

  return (
    <>
      {hasHeader && <Header />}
      <main className={hasHeader ? 'mt-[56px] min-h-[calc(100vh-56px)]' : ''}>
        {children}
      </main>
    </>
  );
}
