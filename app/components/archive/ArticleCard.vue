<script setup lang="ts">
import { formatDate } from "@/utils/content";

interface Props {
  data: {
    id: string;
    date: string;
    slug?: string;
    title: string;
    description?: string;
    tags?: string[];
    locales?: string[];
  }
}

const props = defineProps<Props>();
</script>

<template>
  <article class="group border-l-2 border-transparent pl-4 transition hover:border-accent">
    <header class="mb-2 flex flex-wrap items-baseline gap-2">
      <time class="text-sm uppercase tracking-wide text-neutral-content/40">
        {{ formatDate(data.date) }}
      </time>
      <NuxtLink :to="data.id" class="text-lg font-medium text-blue-600 group-hover:underline dark:text-blue-400">
        {{ data.title }}
      </NuxtLink>
    </header>

    <p v-if="data.description" class="text-neutral-content">
      {{ data.description }}
    </p>

    <ul v-if="data.tags && data.tags.length > 0"
      class="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-secondary-content/40">
      <li v-for="tag in data.tags" :key="tag" class="rounded bg-base-300 px-2 py-1" :aria-label="`Tag: ${tag}`">
        {{ tag }}
      </li>
    </ul>

    <div v-if="data.locales && data.locales.length > 1"
      class="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-content/70">
      <span class="font-semibold uppercase tracking-wide">Languages:</span>
      <ul class="flex flex-wrap gap-2">
        <li v-for="locale in data.locales" :key="locale">
          <NuxtLink :to="`/${data.id}?lang=${locale}`"
            class="rounded-full border border-transparent bg-base-200 px-2 py-1 font-semibold uppercase tracking-wide text-base-content/50 transition hover:border-accent hover:text-accent-content">
            {{ locale }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </article>
</template>
