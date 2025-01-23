import type { Metadata } from 'next';
import './globals.css';
import Image from 'next/image';

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
      <body className="flex h-dvh min-h-screen items-start justify-center bg-gray-100 font-pretendard bg-[url('/images/cat.png')]">
        <div className="relative h-dvh min-h-screen w-full max-w-[425px] bg-white shadow-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
