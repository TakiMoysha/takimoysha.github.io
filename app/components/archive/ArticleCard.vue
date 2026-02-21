<script setup lang="ts">
interface Props {
  slug: string;
  date: string;
  title: string;
  description?: string;
  tags?: string[];
  locales: string[];
}

defineProps<Props>();

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function formatDate(date: string): string {
  return dateFormatter.format(new Date(date));
}
</script>

<template>
  <article
    class="group border-l-2 border-transparent pl-4 transition hover:border-accent"
  >
    <header class="mb-2 flex flex-wrap items-baseline gap-2">
      <time class="text-sm uppercase tracking-wide text-neutral-content/40">
        {{ formatDate(date) }}
      </time>
      <NuxtLink
        :to="`/archive/${slug}`"
        class="text-lg font-medium text-blue-600 group-hover:underline dark:text-blue-400"
      >
        {{ title }}
      </NuxtLink>
    </header>

    <p v-if="description" class="text-neutral-content">
      {{ description }}
    </p>

    <ul
      v-if="tags && tags.length > 0"
      class="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-secondary-content/40"
    >
      <li
        v-for="tag in tags"
        :key="tag"
        class="rounded bg-base-300 px-2 py-1"
        :aria-label="`Tag: ${tag}`"
      >
        {{ tag }}
      </li>
    </ul>

    <div
      v-if="locales.length > 1"
      class="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-content/70"
    >
      <span class="font-semibold uppercase tracking-wide">Languages:</span>
      <ul class="flex flex-wrap gap-2">
        <li v-for="locale in locales" :key="locale">
          <NuxtLink
            :to="`/archive/${slug}?lang=${locale}`"
            class="rounded-full border border-transparent bg-base-200 px-2 py-1 font-semibold uppercase tracking-wide text-base-content/50 transition hover:border-accent hover:text-accent-content"
          >
            {{ locale }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </article>
</template>
