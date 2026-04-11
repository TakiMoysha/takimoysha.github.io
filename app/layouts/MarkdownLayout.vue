<script setup lang="ts">
import BaseLayout from './BaseLayout.vue';
import ArticleProgressBar from '@/components/ArticleProgressBar.vue';
</script>

<template>
  <BaseLayout>
    <template #header><ArticleProgressBar/></template>

    <article class="prose prose-slate mx-auto lg:max-w-4xl p-6 dark:prose-invert">
      <slot />
    </article>

  </BaseLayout>
</template>
