<template>
  <BaseLayout :title="pageTitle" :description="pageDescription">
    <div class="max-w-5xl mx-auto px-4 py-12">
      <header class="mb-14">
        <h1 class="text-4xl font-bold text-base-content mb-3">{{ pageTitle }}</h1>
        <p class="text-lg text-neutral-content">{{ pageDescription }}</p>
      </header>

      <div class="space-y-12">
        <section v-for="year in years" :key="year">
          <header class="mb-6 border-b border-accent/40 pb-2">
            <h2 class="text-2xl font-semibold text-primary-content">{{ year }}</h2>
          </header>

          <div class="space-y-6">
            <article
              v-for="{ group, entry } in postsByYear[year]"
              :key="group.slug"
              class="group border-l-2 border-transparent pl-4 transition hover:border-accent"
            >
              <header class="flex flex-wrap items-baseline gap-2 mb-2">
                <time class="text-sm text-neutral-content/40 uppercase tracking-wide">
                  {{ formatter.format(new Date(entry.date)) }}
                </time>
                <NuxtLink
                  :to="`/archive/${group.slug}`"
                  class="text-lg font-medium text-blue-600 dark:text-blue-400 group-hover:underline"
                >
                  {{ entry.title }}
                </NuxtLink>
              </header>
              <p v-if="entry.description" class="text-neutral-content">
                {{ entry.description }}
              </p>
              <ul v-if="entry.tags && entry.tags.length > 0" class="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-secondary-content/40">
                <li
                  v-for="tag in entry.tags"
                  :key="tag"
                  class="rounded px-2 py-1 bg-base-300"
                  :aria-label="`Tag: ${tag}`"
                >
                  {{ tag }}
                </li>
              </ul>
              <div class="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-content/70">
                <span class="font-semibold uppercase tracking-wide">Languages:</span>
                <ul class="flex flex-wrap gap-2">
                  <li v-for="locale in getLocales(group)" :key="locale">
                    <NuxtLink
                      :to="`/archive/${group.slug}?lang=${locale}`"
                      class="px-2 py-1 rounded-full border border-transparent bg-base-200 text-base-content/50 font-semibold uppercase tracking-wide transition hover:border-accent hover:text-accent-content"
                    >
                      {{ locale }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';
import { DEFAULT_LOCALE } from '@/consts';

interface EntryGroup {
  slug: string;
  locales: Record<string, any>;
}

const pageTitle = 'Archive';
const pageDescription = 'All notes, articles and blog posts.';

const { data: entryGroups } = await useAsyncData(
  'archive-entries',
  async () => {
    const collection = await queryCollection('archive')
      .where('draft', '=', false)
      .order('date', 'DESC')
      .all();

    // Group entries by slug (base name without locale)
    const groups = new Map<string, EntryGroup>();

    for (const entry of collection) {
      // Extract base slug (remove .ru, .en suffixes)
      const baseSlug = entry.id.replace(/\.(ru|en)$/, '');
      const locale = entry.id.match(/\.(ru|en)$/)?.[1] || DEFAULT_LOCALE;

      if (!groups.has(baseSlug)) {
        groups.set(baseSlug, { slug: baseSlug, locales: {} });
      }

      groups.get(baseSlug)!.locales[locale] = entry;
    }

    return Array.from(groups.values());
  },
);

const getRepresentativeEntry = (group: EntryGroup) => {
  const locales = Object.keys(group.locales);
  return group.locales[DEFAULT_LOCALE] ?? group.locales[locales.sort()[0]];
};

const getLocales = (group: EntryGroup) => {
  return Object.keys(group.locales).sort();
};

// Group by year
const postsByYear = computed(() => {
  const result: Record<number, { group: EntryGroup; entry: any }[]> = {};

  for (const group of entryGroups.value || []) {
    const entry = getRepresentativeEntry(group);
    const year = new Date(entry.date).getFullYear();

    if (!result[year]) {
      result[year] = [];
    }

    result[year].push({ group, entry });
  }

  return result;
});

const years = computed(() => {
  return Object.keys(postsByYear.value)
    .map(Number)
    .sort((a, b) => b - a);
});

const formatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});
</script>