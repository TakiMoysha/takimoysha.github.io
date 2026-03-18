<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';
import { computed } from 'vue';
import { parseDate, formatDate } from '@/utils/content';

const archiveContent = await useAsyncData(() => {
  return queryCollection('archive').all();
});

const posts = computed(() => archiveContent.data.value?.slice(0, 5));

const cyclesContent = await queryCollection('cycles').all();
const docsContent = await queryCollection('docs').all();
const projectsContent = await queryCollection('projects').all();
</script>

<template>
  <BaseLayout>
    <div class="max-w-4xl mx-auto px-4">
      <section class="py-12">
        <h2 class="text-2xl font-semibold mb-6 pb-2 border-b">Recent Posts</h2>
        <div class="space-y-8">
          <article v-for="post in posts" :key="post.id" class="group">
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

      <DebugOnly>
        <section class='border-2 border-solid border-amber-400 p-2'>
          <p>Archive Content: {{archiveContent.data.value?.map(item => item.id.concat(";").concat(item.slug || ""))}}
          </p>
          <p>Cycles Content: {{cyclesContent.map(item => item.id)}} </p>
          <p>Docs Content: {{docsContent.map(item => item.id)}} </p>
          <p>Projects Content: {{projectsContent.map(item => item.id)}} </p>
        </section>
      </DebugOnly>

    </div>
  </BaseLayout>
</template>
