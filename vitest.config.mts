import { fileURLToPath } from 'node:url';

import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
    globals: true,
    setupFiles: ['tests/unit/setup.ts'],
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
});
