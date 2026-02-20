<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';

const pageTitle = 'Archive';
const pageDescription = 'All notes, articles and blog posts.';

const { getList } = useLocalizedContent('archive');

const { data: entries } = await useAsyncData('archive-entries', () =>
  getList(),
);

const postsByYear = computed(() => {
  const result: Record<
    number,
    { slug: string; entry: any; locales: string[] }[]
  > = {};

  for (const item of entries.value || []) {
    if (!item.entry) continue;
    const year = new Date(item.entry.date).getFullYear();

    if (!result[year]) {
      result[year] = [];
    }

    result[year].push(item);
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

<template>
  <BaseLayout :title="pageTitle" :description="pageDescription">
    <div class="max-w-5xl mx-auto px-4 py-12">
      <header class="mb-14">
        <h1 class="text-4xl font-bold text-base-content mb-3">
          {{ pageTitle }}
        </h1>
        <p class="text-lg text-neutral-content">{{ pageDescription }}</p>
      </header>

      <div class="space-y-12">
        <section v-for="year in years" :key="year">
          <header class="mb-6 border-b border-accent/40 pb-2">
            <h2 class="text-2xl font-semibold text-primary-content">
              {{ year }}
            </h2>
          </header>

          <div class="space-y-6">
            <article
              v-for="item in postsByYear[year]"
              :key="item.slug"
              class="group border-l-2 border-transparent pl-4 transition hover:border-accent"
            >
              <header class="flex flex-wrap items-baseline gap-2 mb-2">
                <time
                  class="text-sm text-neutral-content/40 uppercase tracking-wide"
                >
                  {{ formatter.format(new Date(item.entry.date)) }}
                </time>
                <NuxtLink
                  :to="`/archive/${item.slug}`"
                  class="text-lg font-medium text-blue-600 dark:text-blue-400 group-hover:underline"
                >
                  {{ item.entry.title }}
                </NuxtLink>
              </header>
              <p v-if="item.entry.description" class="text-neutral-content">
                {{ item.entry.description }}
              </p>
              <ul
                v-if="item.entry.tags && item.entry.tags.length > 0"
                class="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-secondary-content/40"
              >
                <li
                  v-for="tag in item.entry.tags"
                  :key="tag"
                  class="rounded px-2 py-1 bg-base-300"
                  :aria-label="`Tag: ${tag}`"
                >
                  {{ tag }}
                </li>
              </ul>
              <div
                v-if="item.locales.length > 1"
                class="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-content/70"
              >
                <span class="font-semibold uppercase tracking-wide"
                  >Languages:</span
                >
                <ul class="flex flex-wrap gap-2">
                  <li v-for="locale in item.locales" :key="locale">
                    <NuxtLink
                      :to="`/archive/${item.slug}?lang=${locale}`"
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
