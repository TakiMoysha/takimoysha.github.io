<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';
import ArchiveArticleCard from '@/components/archive/ArticleCard.vue';

const pageTitle = 'Archive';
const pageDescription = 'All notes, articles and blog posts.';

const postsByDate = await useAsyncData('archive', async () => {
  return queryCollection('archive').order('date', 'DESC').all();
});
</script>

<template>
  <BaseLayout>
    <div class="mx-auto max-w-5xl px-4 py-12">
      <header class="mb-14">
        <h1 class="mb-3 text-4xl font-bold text-base-content">
          {{ pageTitle }}
        </h1>
        <p class="text-lg text-base-content">{{ pageDescription }}</p>
      </header>

      <div class="space-y-12">
        <template v-for="item in postsByDate.data.value" :key="item.slug">
          <div class="mb-6 border-b border-accent/40 pb-2">
            <div class="space-y-6">
              <ArchiveArticleCard :data="item" />
            </div>
          </div>
        </template>
      </div>

    </div>
  </BaseLayout>
</template>
