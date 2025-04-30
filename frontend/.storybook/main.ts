import { mergeConfig } from 'vite';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import type { StorybookConfig } from '@storybook/experimental-nextjs-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/experimental-addon-test',
  ],
  framework: {
    name: '@storybook/experimental-nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],

  viteFinal: async (config) => {
    return mergeConfig(config, {
      plugins: [
        svgr({
          include: '**/*.svg',
        }),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.svg'],
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@use "@/assets/styles/abstracts/variables" as *;`,
          },
        },
      },
    });
  },
};

export default config;
