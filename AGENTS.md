# AGENTS.md

## Project Overview

This is **Digital Decay** - a blog about development and technology.
It's a **full static web site** built for deployment on GitHub Pages - don't use SSR or server logic.

**Key Technologies:**

- Nuxt 4 (with Nuxt Content for MD/MDX)
- Vue 3 (Composition API, OptionsAPI disabled by config)
- TailwindCSS 4 + NuxtUI 4 (semantic theming)
- UnoCSS (for utilities, faster than Tailwind) (WIP)
- TypeScript
- Biome (linting/formatting)
- Vitest (testing)

**Package Manager:** Use `bun` for all package operations.

You have mcp server:

- chrome-devtools - for debugging pages, use browser from `$BROWSER` env var.

When you complete a task, check AGENTS.md and update it, if required.

---

## Project Structure

Use Standard nuxt project structure.

- `./app/constants.ts` - site constants
- `./content/archive/` - атомарные посты, блог или заметки.
- `./content/series/` - цикл по определенной теме. на верхнем уровне лежат json, описывающие циклы и что содержат.
- `./content/docs/` - documentation about this project
- `./content/projects/` - project page, often these are embedded files, other sites, wasm projects, etc. mdx is used
- `./tests/unit/` - unit tests
- `./tests/nuxt/` - nuxt integration tests
- `./content.config.ts` - content collections config
- `./biome.json` - linting/formatting rules
- `./vitest.config.mts` - test configuration
- `./.oxlintrc` - linting rules (oxlint uses as second linter)


## Commands (see [justfile](justfile))

## Code Style & Conventions

### General

- Use **TypeScript** for all new code
- Use **Composition API** with `<script setup lang="ts">` syntax.

More about tech stack and practices and rules in [SKILLS.md](SKILLS.md) or global skills.

### Vue Components

```vue
<script setup lang="ts">
// Imports first (auto-organized by Biome)
import { computed, ref } from "vue";
import type { SomeType } from "~/types";

// Props with defaults
interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

// Emits
const emit = defineEmits<{
  update: [value: string];
}>();

// Composables
const { data } = useContent();
const route = useRoute();

// Reactive state
const isOpen = ref(false);

// Computed
const displayTitle = computed(() => props.title.toUpperCase());

// Methods
function handleClick() {
  emit("update", "new value");
}
</script>

<template>
  <div class="my-component">
    <h1>{{ displayTitle }}</h1>
  </div>
</template>
```

### Styling

```html
<section>
  <h4>Base</h4>
  <div class="text-primary-content bg-primary">
    text-primary-content + bg-primary
  </div>
  <div class="text-secondary-content bg-secondary">
    text-secondary-content + bg-secondary
  </div>
  <div class="text-accent-content bg-accent">
    text-accent-content + bg-accent
  </div>
  <div class="text-neutral-content bg-neutral">
    text-neutral-content + bg-neutral
  </div>

  <h4>Signals</h4>
  <div class="bg-info text-info-content">text-info-content + bg-info</div>
  <div class="bg-success text-success-content">
    text-success-content + bg-success
  </div>
  <div class="bg-warning text-warning-content">
    text-warning-content + bg-warning
  </div>
  <div class="bg-error text-error-content">text-error-content + bg-error</div>

  <h4>Background and Surface</h4>
  <div class="text-base-content bg-base-100">
    text-base-content + bg-base-100
  </div>
  <div class="text-base-content bg-base-200">
    text-base-content + bg-base-200
  </div>
  <div class="text-base-content bg-base-300">
    text-base-content + bg-base-300
  </div>
  <div class="text-base-content bg-base-400">
    text-base-content + bg-base-400
  </div>
</section>
```

See full style reference in `app/assets/styles/main.css`.

### Content Collections

Content is managed via `@nuxt/content` with these collections (defined in `content.config.ts`):

- `docs` - Documentation pages (`content/docs/*`)
- `archive` - Blog posts (`content/archive/*.md`)
- `series` - JSON data files (`content/series/*.json`)
- `projects` - Project pages (`content/projects/*.mdx`)

**Accessing content:**

Use `useContent()` or `useContentQuery` to access content and compatible with static preset

```typescript
const post = await useContent();
```

---

## Internationalization (i18n)

Supported locales:

- `en` (default) - English (en-US)
- `ru` - Russian (ru-RU)

---

## Testing

### Unit Tests (`tests/unit/`)

Test pure functions and utilities:

```typescript
import { describe, expect, it } from "vitest";
import { someUtility } from "~/utils";

describe("someUtility", () => {
  it("should return expected result", () => {
    expect(someUtility("input")).toBe("output");
  });
});
```

### Nuxt Tests (`tests/nuxt/`)

Test components and composables with Nuxt environment:

```typescript
import { describe, expect, it } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";

describe("My Page", async () => {
  await setup({});

  it("renders index page", async () => {
    const html = await $fetch("/");
    expect(html).toContain("Digital Decay");
  });
});
```

## Static Site Generation (SSG)

This project generates a static site for GitHub Pages:

- `ssr: true` in `nuxt.config.ts` — pages are rendered to HTML at build time (needed for schema.org/SEO)
- Nitro preset: `github-pages`
- All routes are prerendered at build time (`/rss.xml` explicitly listed in `nitro.prerender.routes`)
- Sitemap generated automatically (`@nuxtjs/sitemap`)
- RSS feed served from `server/routes/rss.xml.ts` (prerendered, no feed module)

**Important:** All dynamic content must be available at build time via Nuxt Content.

**Note:** `content.experimental.sqliteConnector: 'native'` — uses built-in `node:sqlite` (Node >= 22.5). Don't use the default better-sqlite3 connector: its native binary breaks with "module did not self-register" when Node ABI changes.

## Testing Commands

Use vitest, not `bun test` (Bun's own runner ignores `vitest.config.mts` — aliases/setup won't apply):

```bash
bunx vitest run          # all tests
bun run test             # watch mode
```

## SEO & Meta

- SEO handled by `@nuxtjs/seo` module
- OG images generated at build time (`nuxt-og-image`, currently disabled)
- HTML validation enabled (`@nuxtjs/html-validator`)
- Use `<Head>` and `<Title>` components from `@unhead/vue`

## Security

- `nuxt-security` module enabled in production
- Security headers configured in `nuxt.config.ts`
- CORS policies applied via route rules

## Best Practices

1. **Write tests for utilities** in `app/utils/`
2. **Use semantic HTML**
3. **Leverage auto-imports** - components and composables are auto-imported
4. **Use TypeScript strictly** - define interfaces for props and returns
5. **Keep components small** - extract logic to composables when possible
6. **Test static generation** with `bun run generate` before deployment
7. **Use Nuxt Content** for content management

## Documentation

If information is missing, don't assume - ask the user.
For detailed tool capabilities, see [SKILLS.md](SKILLS.md).
