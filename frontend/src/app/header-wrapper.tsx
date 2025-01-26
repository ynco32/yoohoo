'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layouts/Header/Header';

export default function HeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pagesWithoutHeader = ['/', '/login', '/main'];

  return (
    <>
      {!pagesWithoutHeader.includes(pathname) && <Header />}
      {children}
    </>
  );
}
