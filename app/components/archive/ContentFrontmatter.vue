<script setup lang="ts">
import { formatDate } from '@/utils/content';

export interface Props {
  value: {
    title: string;
    description?: string;
    date?: string;
    tags?: string[];
    zerolinks?: string[];
  }
}

defineProps<Props>();
</script>

<template>
  <div class="mb-8 pb-6 border-b border-base-content/10">
    <h1 class="text-3xl font-bold mb-2">{{ value.title }}</h1>

    <div class="flex flex-wrap items-center gap-3 text-sm text-base-content/60">
      <time v-if="value.date" :datetime="value.date">{{ formatDate(value.date) }}</time>

      <template v-if="value.tags?.length">
        <span>·</span>
        <div class="gap-2 inline-flex items-center">
          <UBadge v-for="tag in value.tags" :key="tag" color="secondary" size="sm"> {{ tag }}</UBadge>
        </div>
      </template>
    </div>

    <div v-if="value.description" class="mt-4">
      <UAccordion :items="[{ label: 'Description', content: value.description }]" />
    </div>
    <div v-if="value.zerolinks?.length">
      <UAccordion :items="[{ label: 'Relations', content: value.zerolinks.join(', ') }]" />
    </div>
  </div>

</template>
