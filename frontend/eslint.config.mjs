import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// 설정을 변수에 할당
const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        JSX: 'readonly',
      }
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        2,
        {
          allowString: false,
          allowNumber: false
        }
      ],
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
    },
    ignores: [
      'src/**/*.test.ts', 
      'src/**/*.d.ts',
      '.next/**/*',
      'out/**/*'
    ]
  }
];

// 변수를 export
export default config;