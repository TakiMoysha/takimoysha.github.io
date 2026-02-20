# AGENTS.md

You are an expert in JavaScript/TypeScript, Nuxt 4, Vue 3, and web application development.
You write maintainable, performant, and accessible code.

## Project Overview

This is **Digital Decay** - a blog about development and technology.
It's a full static site built for deployment on GitHub Pages.

**Key Technologies:**

- Nuxt 4 (with Nuxt Content for MD/MDX)
- Vue 3 (Composition API, OptionsAPI disabled)
- TailwindCSS 4 + DaisyUI 5 (semantic theming)
- UnoCSS (for utilities, faster than Tailwind)
- TypeScript
- Biome (linting/formatting)
- Vitest (testing)

**Package Manager:** Use `bun` for all package operations.

---

## Project Structure

```
├── app/
│   ├── assets/
│   │   ├── styles/mail.css      # Tailwind
│   │   └── icons/                 # SVG icons
│   ├── components/                # Vue components (auto-imported)
│   │   ├── RootSeo.vue
│   │   ├── RootHeader.vue
│   │   ├── RootFooter.vue
│   │   └── ...
│   ├── composables/               # Vue composables (auto-imported)
│   ├── layouts/                   # Nuxt layouts
│   │   ├── BaseLayout.vue
│   │   ├── BookLayout.vue
│   │   └── ...
│   ├── lib/                       # Utility functions
│   ├── pages/                     # File-based routing
│   │   ├── index.vue
│   │   ├── archive/
│   │   ├── cycles/
│   │   └── projects/
│   ├── consts.ts                  # Site constants
│   └── app.vue                    # Root app component
├── content/                       # Nuxt Content collections
│   ├── archive/*.md               # Blog posts
│   ├── cycles/*.json              # Data files
│   └── projects/*.mdx             # Project pages
├── tests/
│   ├── unit/                      # Unit tests
│   └── nuxt/                      # Nuxt integration tests
├── nuxt.config.ts                 # Nuxt configuration
├── content.config.ts              # Content collections config
├── biome.json                     # Linting/formatting rules
└── vitest.config.mts              # Test configuration
```

---

## Commands

```bash
# Development
bun run dev              # Start dev server

# Building
bun run generate         # Generate static site (for GitHub Pages)
bun run build            # Build for production

# Testing
bun test                 # Run all tests
bun test -- --project=unit       # Run unit tests only
bun test -- --project=nuxt       # Run Nuxt tests only
```

Also see [justfile](justfile).

---

## Code Style & Conventions

### General

- Use **TypeScript** for all new code
- Use **Composition API** with `<script setup>` syntax
- OptionsAPI is disabled in Vite config
- Prefer `const` over `let`, never use `var`
- Use single quotes for strings
- 2 spaces for indentation

More about tech stack and practices and rules in [SKILLS.md](SKILLS.md).

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

### Styling (UnoCSS based on tailwindcss and semantic approach)

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
- `cycles` - JSON data files (`content/cycles/*.json`)
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

Content files can include locale suffixes:

- `post.md` - Default locale
- `post.ru.md` - Russian version
- `post.en.md` - English version

Use `const { locale } = useI18n()` for locale-aware logic.

---

## Testing

### Unit Tests (`tests/unit/`)

Test pure functions and utilities:

```typescript
import { describe, expect, it } from "vitest";
import { someUtility } from "~/lib/utils";

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

---

## Static Site Generation (SSG)

This project generates a static site for GitHub Pages:

- `ssr: false` in `nuxt.config.ts`
- Nitro preset: `static`
- All routes are prerendered at build time
- Sitemap generated automatically (`@nuxtjs/sitemap`)

**Important:** All dynamic content must be available at build time via Nuxt Content.

---

## SEO & Meta

- SEO handled by `@nuxtjs/seo` module
- OG images generated at build time (`nuxt-og-image`, currently disabled)
- HTML validation enabled (`@nuxtjs/html-validator`)
- Use `<Head>` and `<Title>` components from `@unhead/vue`

---

## Security

- `nuxt-security` module enabled in production
- Security headers configured in `nuxt.config.ts`
- CORS policies applied via route rules

---

## Best Practices

1. **Write tests for utilities** in `app/lib/`
2. **Use semantic HTML**
3. **Leverage auto-imports** - components and composables are auto-imported
4. **Use TypeScript strictly** - define interfaces for props and returns
5. **Keep components small** - extract logic to composables when possible
6. **Test static generation** with `bun run generate` before deployment

---

## Documentation

If information is missing, don't assume - ask the user.
For detailed tool capabilities, see [SKILLS.md](SKILLS.md).
