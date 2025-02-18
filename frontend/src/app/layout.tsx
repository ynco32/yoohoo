import type { Metadata } from 'next';
import './globals.css';
import MSWProvider from '@/provider/MSWProvider';
import { AuthGuard } from '@/provider/authGuard';
import HeaderWrapper from './header-wrapper';

export const metadata: Metadata = {
  title: 'CONKIRI',
  description: 'CONKIRI',
  icons: {
    icon: '/favicon.ico',
  },
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
      <body className="flex h-[100dvh] flex-col overflow-hidden bg-web bg-cover bg-center font-pretendard">
        <MSWProvider />
        <div className="container relative flex h-[100dvh] max-w-layout flex-1 flex-col bg-white p-0 shadow-lg">
          <AuthGuard>
            <HeaderWrapper />
            <main className="flex-1 overflow-auto">{children}</main>
          </AuthGuard>
        </div>
      </body>
    </html>
  );
}
