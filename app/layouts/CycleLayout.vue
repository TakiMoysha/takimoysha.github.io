<script setup lang="ts">
import BaseLayout from './BaseLayout.vue';

interface Props {
  title?: string;
  description?: string;
}

defineProps<Props>();
</script>
<template>
  <BaseLayout :title="title || 'Cycle Page'" :description="description">
    <div class="book-layout">
      <slot />
    </div>
  </BaseLayout>
</template>
