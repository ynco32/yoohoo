import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// 설정을 변수에 할당
const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      // [TypeScript] 타입 정보를 사용하도록 파서 옵션 설정
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.eslint.json', // ESLint 전용 TypeScript 설정 파일로 변경
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        JSX: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        2,
        {
          allowString: false,
          allowNumber: false,
        },
      ],
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
    },
    // [추가] TypeScript 플러그인 설정
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    ignores: ['src/**/*.test.ts', 'src/**/*.d.ts', '.next/**/*', 'out/**/*'],
  },
];

// 변수를 export
export default config;
