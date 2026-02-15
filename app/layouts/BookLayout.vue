<template>
  <BaseLayout :title="title || 'Book'" :description="description">
    <div class="book-layout">
      <slot />
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from './BaseLayout.vue';

interface Props {
  title?: string;
  description?: string;
}

defineProps<Props>();
</script>

<style scoped>
.book-layout {
  /* TODO: Add book-specific styles */
}
</style>
