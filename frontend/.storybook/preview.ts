import '../src/app/globals.css';
import { initialize, mswLoader } from 'msw-storybook-addon';

// Initialize MSW
initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: '/mockServiceWorker.js',
    options: {
      scope: '/',
    },
  },
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
};

export const loaders = [mswLoader];
