<script setup lang="ts">
import MarkdownLayout from '@/layouts/MarkdownLayout.vue';
import { parseDate } from '~/utils/content';

const route = useRoute();

const { data } = await useAsyncData(route.path, () => {
  return queryCollection('archive').path(route.path).first();
});

const formattedDate = computed(() => {
  if (!data.value?.date) return null;
  const parsed = parseDate(data.value.date);
  return parsed?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const showDescription = ref(false);
const hasDescription = computed(() => !!data.value?.description);
</script>

<template>
  <MarkdownLayout>
    <div v-if="data" class="mb-8 pb-6 border-b border-base-content/10">
      <h1 class="text-3xl font-bold mb-2">{{ data.title }}</h1>

      <div class="flex flex-wrap items-center gap-3 text-sm text-base-content/60">
        <time v-if="formattedDate" :datetime="data.date">{{ formattedDate }}</time>

        <template v-if="data.tags?.length">
          <span>·</span>
          <div class="gap-2 inline-flex items-center">
            <UBadge v-for="tag in data.tags" :key="tag" color="secondary" size="sm"> {{ tag }}</UBadge>
          </div>
        </template>

        <template v-if="data.zerolinks?.length">
          <span>·</span>
          <div class="gap-2 inline-flex items-center">
            <span v-for="link in data.zerolinks" :key="link"
              class="text-xs text-base-content/50 hover:text-base-content/80 transition-colors cursor-pointer">
              {{ link }}
            </span>
          </div>
        </template>
      </div>

      <div v-if="hasDescription" class="mt-4">
        <button type="button"
          class="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          @click="showDescription = !showDescription">
          <span class="text-base-content/60">{{ showDescription ? 'Hide description' : 'Description' }}</span>
          <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': showDescription }" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <p v-if="showDescription" class="mt-2 text-base-content/80 pl-6 border-l-2 border-primary/30">
          {{ data.description }}
        </p>
      </div>
    </div>

    <ContentRenderer v-if="data" :value="data" />
  </MarkdownLayout>
</template>
