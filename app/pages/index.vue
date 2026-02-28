<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';
import useArchiveContent from '@/composables/useArchiveContent';
import { computed } from 'vue';
import { parseDate } from '@/utils/content';

const archiveContentCompose = useArchiveContent();

const archiveContent = await useAsyncData(() => {
  if (import.meta.client && !import.meta.dev) return Promise.resolve([]);

  return queryCollection('archive').all();
});

const formatDate = (datastr: string) => {
  return parseDate(datastr)?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
const posts = computed(() => archiveContent.data.value?.slice(0, 5));
</script>

<template>
  <BaseLayout title="Digital Decay" description="Blog, notes and reports about development.">
    <div class="max-w-4xl mx-auto px-4">
      <section class="py-12">
        <h2 class="text-2xl font-semibold mb-6 pb-2 border-b">Posts</h2>
        <div class="space-y-8">
          <article v-for="post in posts" :key="post.id" class="group">
            <NuxtLink :to="`/archive/${post.slug}`" class="block">
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

      <DebugOnly>
        <hr class="border-amber-400" />
        <section>
          Archive Content: {{ archiveContent.data.value?.map(item => item.id.concat(";").concat(item.slug)) }}
        </section>
      </DebugOnly>

    </div>
  </BaseLayout>
</template>
