import type { Metadata } from 'next';
import './globals.css';
import MSWProvider from '@/provider/MSWProvider';
import { AuthGuard } from '@/provider/authGuard';
import HeaderWrapper from './header-wrapper';

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-web flex h-screen flex-col overflow-hidden font-pretendard">
        <MSWProvider />
        <div className="max-w-layout container relative flex flex-1 flex-col bg-white p-0 shadow-lg">
          <AuthGuard>
          <HeaderWrapper />
          <main className="min-h-full flex-1 overflow-auto">{children}</main>
          </AuthGuard>
        </div>
      </body>
    </html>
  );
}
