<script setup lang="ts">
import MarkdownLayout from '@/layouts/MarkdownLayout.vue';
import ContentFrontmatter from "@/components/archive/ContentFrontmatter.vue";

const route = useRoute();

const { data } = await useAsyncData(route.path, () => {
  return queryCollection('archive').path(route.path).first();
});
</script>

<template>
  <MarkdownLayout>
    <ContentFrontmatter v-if="data" :value="data" />
    <ContentRenderer v-if="data" :value="data" />
  </MarkdownLayout>
</template>
