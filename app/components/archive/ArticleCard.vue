<script setup lang="ts">
import { formatDate } from '@/utils/content';

interface Props {
  value: {
    id: string;
    path: string;
    date: string;
    slug?: string;
    title: string;
    description?: string;
    tags?: string[];
    locales?: string[];
  };
}

defineProps<Props>();
</script>

<template>
  <article class="group border-l-2 border-transparent pl-4 transition hover:border-accent">
    <header class="mb-2 flex flex-wrap items-baseline gap-2">
      <time class="text-sm uppercase tracking-wide text-neutral-content/40">
        {{ formatDate(value.date) }}
      </time>
      <NuxtLink :to="value.slug || value.path"
        class="text-lg font-medium text-blue-600 group-hover:underline dark:text-blue-400">
        {{ value.title }}
      </NuxtLink>
    </header>

    <p v-if="value.description" class="text-neutral-content">
      {{ value.description }}
    </p>

    <ul v-if="value.tags && value.tags.length > 0"
      class="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-secondary-content/40">
      <li v-for="tag in value.tags" :key="tag" class="rounded bg-base-300 px-2 py-1" :aria-label="`Tag: ${tag}`">
        {{ tag }}
      </li>
    </ul>

    <div v-if="value.locales && value.locales.length > 0"
      class="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-content/70">
      <span class="font-semibold uppercase tracking-wide">Languages:</span>
      <ul class="flex flex-wrap gap-2">
        <li v-for="locale in value.locales" :key="locale">
          <NuxtLink :to="`/${value.path}?lang=${locale}`"
            class="rounded-full border border-transparent bg-base-200 px-2 py-1 font-semibold uppercase tracking-wide text-base-content/50 transition hover:border-accent hover:text-accent-content">
            {{ locale }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </article>
</template>
