<template>
  <BaseLayout :title="pageTitle" :description="pageDescription">
    <div class="mx-auto max-w-4xl px-4 py-12">
      <header class="mb-10">
        <h1 class="mb-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {{ fallbackEntry?.title }}
        </h1>
        <p v-if="fallbackEntry?.description" class="text-lg text-gray-600 dark:text-gray-400">
          {{ fallbackEntry.description }}
        </p>
        <div v-if="locales.length > 1" class="mt-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span class="font-semibold uppercase tracking-wide">Languages:</span>
          <ul class="flex flex-wrap gap-2">
            <li v-for="loc in locales" :key="loc">
              <button
                @click="setActiveLocale(loc)"
                :class="[
                  'rounded-full border border-transparent px-3 py-1 font-semibold uppercase tracking-wide transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700',
                  loc === activeLocale
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-200'
                ]"
              >
                {{ loc }}
              </button>
            </li>
          </ul>
        </div>
      </header>

      <div class="prose dark:prose-invert max-w-none">
        <article
          v-for="entry in entries"
          :key="entry.locale"
          v-show="entry.locale === activeLocale"
          :data-locale="entry.locale"
        >
          <header class="mb-8 border-b border-gray-200 pb-4 dark:border-gray-700">
            <time class="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {{ formatDate(entry.data.date) }}
            </time>
          </header>

          <ContentRenderer :value="entry.data" />
        </article>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';

const route = useRoute();
const slug = route.params.slug as string;

const { getGrouped } = useLocalizedContent('archive');

const { data: group } = await useAsyncData(`archive-${slug}`, async () => {
  const groups = await getGrouped();
  return groups.get(slug) || null;
});

if (!group.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  });
}

const locales = computed(() => Object.keys(group.value?.locales || {}).sort());

const fallbackLocale = computed(() => {
  if (group.value?.locales['en']) return 'en';
  return locales.value[0];
});

const activeLocale = ref(fallbackLocale.value);

const fallbackEntry = computed(() => {
  return group.value?.locales[fallbackLocale.value];
});

const entries = computed(() => {
  if (!group.value) return [];
  return locales.value.map((loc) => ({
    locale: loc,
    data: group.value!.locales[loc],
  }));
});

const pageTitle = computed(() => {
  return `${fallbackEntry.value?.title || 'Archive'} | Archive`;
});

const pageDescription = computed(() => {
  return fallbackEntry.value?.description || '';
});

const setActiveLocale = (loc: string) => {
  activeLocale.value = loc;
};

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>
