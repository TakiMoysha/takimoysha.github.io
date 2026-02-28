<script setup lang="ts">
import MarkdownLayout from '@/layouts/MarkdownLayout';

const route = useRoute();

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('archive').path(route.path).first()
})
</script>

<template>
  <MarkdownLayout>
    <ContentRenderer v-if="page" :value="page" />
  </MarkdownLayout>
</template>
