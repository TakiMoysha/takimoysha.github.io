import {
  defineVitestConfig,
  defineVitestProject,
} from '@nuxt/test-utils/config';
import { configDefaults, defineConfig } from 'vitest/config';

const integrationTests = defineVitestProject({
  test: {
    name: 'nuxt',
    dir: 'tests/nuxt',
    environmentOptions: {
      nuxt: { overrides: { ogImage: { enabled: false } } },
    },
  },
});

export default defineVitestConfig({
  test: {
    projects: ['tests/unit', integrationTests],
  },
});
