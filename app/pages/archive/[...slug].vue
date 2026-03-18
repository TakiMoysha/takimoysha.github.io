<script setup lang="ts">
import MarkdownLayout from '@/layouts/MarkdownLayout.vue';
import ContentFrontmatter from "@/components/archive/ContentFrontmatter.vue";
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
    <ContentFrontmatter v-if="data" :value="data" />
    <ContentRenderer v-if="data" :value="data" />
  </MarkdownLayout>
</template>
