## Skills Documentation

- reference https://github.com/onmax/nuxt-skills
- specification https://agentskills.io/specification

## Content

Content support multilanguage (i18n).

At the top of the file you can see is YamlFrontmatter:

```md
---
title: SQL (ТЕСТ)
description: Тестовый файл для проверки markdown и дизайна.
date: 202109151046
tags: [dml, ddl]
zerolinks:
  - [[0 Databases]]
---
```

### markdown Formatter


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
      image: z.object({
        title: z.string(),
        cover: image().refine(img) => img.width >= 1200, { msg: "Cover should be at least 1200px wide" }, }),
        thumbnail: image().optional(),
      }),
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

## Working with nuxt-content


```ts
const queryRecentContent = queryCollection('archive')
  .where('draft', '=', false)
  .order('date', 'DESC')
  .limit(5)
  .all();

```
