<script setup lang="ts">
import BaseLayout from './BaseLayout.vue';
import ArticleProgressBar from '@/components/ArticleProgressBar.vue';

interface Props {
  title?: string;
  description?: string;
}
const props = defineProps<Props>();
</script>

<template>
  <BaseLayout :title="title" :description="description">
    <ArticleProgressBar />
    <article class="prose prose-slate mx-auto max-w-2xl p-6 dark:prose-invert">
      <div>
        <!-- TODO: maybe set mdx, how working with astrojs/content extension -->
        <section class="markdown">
          <slot />
        </section>
      </div>
    </article>
  </BaseLayout>
</template>
