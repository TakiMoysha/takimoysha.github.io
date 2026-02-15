<template>
  <BaseLayout title="Digital Decay" description="Blog, notes and reports about development.">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <section class="mb-16">
        <h2 class="text-2xl font-semibold mb-6 pb-2 border-b">Latest Posts</h2>
        <div class="space-y-8">
          <article v-for="post in posts" :key="post.id" class="group">
            <NuxtLink :to="`/archive/${post.slug}`" class="block">
              <h3 class="text-xl font-medium text-blue-600 dark:text-blue-400 group-hover:underline mb-1">
                {{ post.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {{ formatDate(post.date) }}
              </p>
              <p class="text-gray-700 dark:text-gray-300">
                {{ post.description }}
              </p>
            </NuxtLink>
          </article>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <!-- About and Quick Links sections commented out for now -->
      </section>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';

const { data: posts } = await useAsyncData('latest-posts', async () => {
  const collection = await queryCollection('archive')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .limit(5)
    .all();

  return collection.map((post) => ({
    id: post.id,
    slug: post.slug || post.id,
    title: post.title,
    description: post.description || '',
    date: post.date,
  }));
});

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>
