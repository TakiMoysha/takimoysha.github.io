<script setup lang="ts">
import ContentFrontmatter from '@/components/archive/ContentFrontmatter.vue';

definePageMeta({
  layout: 'markdown-layout',
});

const route = useRoute();

const { data } = await useAsyncData(route.path, () => {
  return queryCollection('archive').path(route.path).first();
});
</script>

<template>
  <ContentFrontmatter v-if="data" :value="data" />
  <ContentRenderer v-if="data" :value="data" />
</template>
