import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: '../../../../../scripts/vitest-jsdom-environment.mjs',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'dist',
        'node_modules',
        '**/*.d.ts',
        '**/*.config.*',
        '**/tests/**',
        'vitest.config.ts',
        'package.json',
        'tsconfig.json',
        '.gitignore',
        'README.md',
        'coverage/**',
        '**/index.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
