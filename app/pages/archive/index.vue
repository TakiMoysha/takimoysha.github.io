<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';

const pageTitle = 'Archive';
const pageDescription = 'All notes, articles and blog posts.';

const postsByYear = await useAsyncData('archive', async () => {
  let content = await queryCollection('archive').all();
  return content;
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

      <DebugOnly>
        <section>
          {{ postsByYear }}
        </section>
      </DebugOnly>

      <!--
        <div class="space-y-12">
          <section v-for="(year,index) in postsByYear" :key="year">
            <header class="mb-6 border-b border-accent/40 pb-2">
              <h2 class="text-2xl font-semibold text-primary-content">
                {{ year }}
              </h2>
            </header>

            <div class="space-y-6">
              <ArchiveArticleCard v-for="item in postsByYear[year]" :key="item.slug" :slug="item.slug"
                :date="item.entry.date" :title="item.entry.title" :description="item.entry.description"
                :tags="item.entry.tags" :locales="item.locales" />
            </div>
          </section>
        </div>

      -->
    </div>
  </BaseLayout>
</template>
