import { coverageConfigDefaults, defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/*/vitest.config.ts',
  'packages/*/*/vitest.config.ts', // For nested packages like packages/domain/models
  {
    test: {
      globals: true,
      environment: 'node',
    },
  },
]);
