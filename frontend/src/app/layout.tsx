import type { Metadata } from 'next';
import './globals.css';
import HeaderWrapper from './header-wrapper';
import MSWProvider from '@/provider/MSWProvider';

export const metadata: Metadata = {
  title: 'CONKIRI',
  description: 'CONKIRI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-dvh min-h-screen items-start justify-center bg-gray-100 bg-[url('/images/cat.png')] font-pretendard">
        <MSWProvider /> {/* MSWProvider를 정상적으로 사용 */}
        <div className="relative h-dvh min-h-screen w-full max-w-[430px] bg-background-default shadow-lg">
          <HeaderWrapper>{children}</HeaderWrapper>
        </div>
      </body>
    </html>
  );
}
