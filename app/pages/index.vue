<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';
import { formatDate } from '@/utils/content';

const archiveContent = await useAsyncData(() => {
  return queryCollection('archive').order('date', 'DESC').all();
});

const posts = computed(() => archiveContent.data.value?.slice(0, 5));
</script>

<template>
  <BaseLayout>
    <div class="max-w-4xl mx-auto px-4">
      <section class="py-12">
        <h2 class="text-2xl font-semibold mb-6 pb-2 border-b">Recent Posts</h2>
        <div class="space-y-8">
          <article v-if="posts" v-for="post in posts" :key="post.id" class="group">
            <NuxtLink :to="`${post.slug || post.path}`" class="block">
              <h3 class="text-xl font-medium text-blue-600 dark:text-blue-400 group-hover:underline mb-1">
                {{ post.title }}
              </h3>
              <p class="text-base-300-content text-sm mb-2">
                {{ formatDate(post.date) }}
              </p>
              <p class="text-base-content">
                {{ post.description }}
              </p>
            </NuxtLink>
          </article>
        </div>
      </section>
    </div>
  </BaseLayout>
</template>
