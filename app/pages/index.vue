<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';

const { getList } = useLocalizedContent('archive');

const { data: posts } = await useAsyncData('latest-posts', async () => {
  const entries = await getList();
  return entries
    .sort(
      (a, b) =>
        new Date(b.entry?.date || 0).getTime() -
        new Date(a.entry?.date || 0).getTime(),
    )
    .slice(0, 5)
    .map((item) => ({
      id: item.entry?.id,
      slug: item.slug,
      title: item.entry?.title,
      description: item.entry?.description || '',
      date: item.entry?.date,
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

<template>
  <BaseLayout
    title="Digital Decay"
    description="Blog, notes and reports about development."
  >
    <div class="max-w-4xl mx-auto px-4 py-12">
      <section class="mb-16">
        <h2 class="text-2xl font-semibold mb-6 pb-2 border-b">Latest Posts</h2>
        <div class="space-y-8">
          <article v-for="post in posts" :key="post.id" class="group">
            <NuxtLink :to="`/archive/${post.slug}`" class="block">
              <h3
                class="text-xl font-medium text-blue-600 dark:text-blue-400 group-hover:underline mb-1"
              >
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
      </section>
    </div>
  </BaseLayout>
</template>
