import type { Metadata } from 'next';
import '@/assets/styles/globals.scss';
import styles from '@/app/layout.module.scss';
import { HeaderProvider } from '@/components/layout/Header/HeaderProvider';
import SideBar from '@/components/layout/Header/SideBar';
import { Providers } from './providers';
import ChatbotProvider from '@/components/chatbot/ChatbotProvider/ChatbotProvider';
import { NotificationProvider } from '@/components/notification/NotificationProvider';

const APP_NAME = '콘끼리'; // 설치되는 이름
const APP_DEFAULT_TITLE = '콘끼리 - 콘서트를 더 즐겁게🎵'; // 탭 상단에 뜨는 설명
const APP_TITLE_TEMPLATE = '%s | 콘끼리 CONKIRI'; // 각 페이지 뒤에 뜨는 설명
const APP_DESCRIPTION = '모두의 콘서트 도우미'; // 웹사이트 설명

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  themeColor: '#4986e8',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#4986e8' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <head></head>
      <body className={styles.body}>
        <Providers>
          <NotificationProvider />
          <ChatbotProvider>
            <HeaderProvider>
              <SideBar />
              <div className={styles.main}>{children}</div>
            </HeaderProvider>
          </ChatbotProvider>
        </Providers>
      </body>
    </html>
  );
}
