## Content Localization

This project uses file-based localization with locale postfixes.

### File Naming Convention

Content files use locale postfixes before the file extension:

```
content/archive/
├── post.md           # Default locale (en)
├── post.ru.md        # Russian version
├── sql.en.mdx        # English (explicit)
└── sql.ru.mdx        # Russian
```

### Supported Locales

- `en` (default) - English (en-US)
- `ru` - Russian (ru-RU)

### How It Works

1. **Hook** (`nuxt.config.ts`): Extracts locale from file ID and adds `locale` field to content
2. **Schema** (`content.config.ts`): Each collection has `locale: z.string().default('en')`
3. **Composable** (`useLocalizedContent`): Groups content by base slug, provides locale-aware queries

### Usage in Components

```vue
<script setup lang="ts">
const { getBySlug, getList } = useLocalizedContent('archive');

// Single entry with locale fallback
const { data: entry } = await useAsyncData('post', () => getBySlug('my-post'));

// List of entries for current locale
const { data: entries } = await useAsyncData('archive', () => getList());
</script>
```

### Utilities

Location: `app/utils/content-locale.ts`

- `parseLocaleFromId(id)` - Extracts `{ baseSlug, locale }` from file ID
- `groupByLocale(items)` - Groups items by base slug with locale variants
- `getLocalizedEntry(group, preferredLocale, fallbackLocale)` - Gets entry with fallback

---

## Skills Documentation

- reference https://github.com/onmax/nuxt-skills
- specification https://agentskills.io/specification

## Semantic CSS

Use NuxtUI and TailwindCSS.

## Zod Schema

```js
const content = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content" }),
  schema: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("article"),
      title: z.string(),
      author: z.string(),
      readingTime: z.number(),
    }),
    z.object({
      type: z.literal("video"),
      title: z.string(),
      videoUrl: z.string().url(),
      duration: z.string(),
      image: z.boject({
        title: z.string(),
        cover: image().refine(img) => img.width >= 1200, { msg: "Cover should be at least 1200px wide" }, }),
        thumbnail: image().optional(),
      }),
    }),
    z.object({
      type: z.literal("podcast"),
      title: z.string(),
      audioUrl: z.string().url(),
      guests: z.array(z.string()),
    }),
  ]),
});

const countries = defineCollection({
  loader: async () => {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();

    // Must return array with id property on each entry
    return data.map((country) => ({
      id: country.cca3,
      name: country.name.common,
      capital: country.capital?.[0],
      population: country.population,
      region: country.region,
    }));
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    capital: z.string().optional(),
    population: z.number(),
    region: z.string(),
  }),
});

```

```astro
export async function getStaticPaths() {
  const posts = await getCollection("blog");
  const tags = [ ...new Set(posts.flatMap((post) -> post.data.tags))];
  return tags.map((tag) => ({
    params: { tag },
    props: {
      tag,
      posts: posts.filter((post) => post.data.tags.includes(tag)),
    }
  }));
}

const { tag, posts } = Astro.props;
```
