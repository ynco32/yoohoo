import '../src/app/globals.css';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

// Initialize MSW
initialize({
  onUnhandledRequest: 'bypass',
});

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  msw: {
    handlers: [],
  },
  nextjs: { appDirectory: true },
  viewport: {
    viewports: INITIAL_VIEWPORTS, // 기본 제공되는 viewport 목록 추가
    defaultViewport: 'responsive', // 'desktop' 대신 'responsive'로 변경
  },
};

// MSW v1에서는 loader 대신 decorator를 사용합니다
export const decorators = [mswDecorator];
