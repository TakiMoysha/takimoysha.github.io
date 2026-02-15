<template>
  <BaseLayout :title="title" :description="description">
    <div class="w-screen min-h-svh grid grid-cols-1 lg:grid-cols-12 gap-0">
      <section class="lg:col-span-9 xl:col-span-10 min-h-svh">
        <div class="w-full h-full">
          <slot />
        </div>
      </section>

      <aside class="hidden lg:block lg:col-span-3 xl:col-span-2 border-l border-border/50 bg-muted/20">
        <div class="sticky top-0 max-h-svh overflow-y-auto p-4">
          <slot name="sidebar" />
        </div>
      </aside>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from './BaseLayout.vue';

interface Props {
  title: string;
  description: string | undefined;
}

defineProps<Props>();
</script>
