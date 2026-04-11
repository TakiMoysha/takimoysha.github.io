<script setup lang="ts">
const scrollPercent = computed(() => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const _percent = (scrollTop / (scrollHeight - clientHeight)) * 100;
  return _percent;
});
</script>

<template>
  <div class="fixed top-0 left-0 h-20px transition-[width] duration-100 ease-out bg-color-accent z-0">
    <div class="h-full bg-blue-500" id="readingProgress" :style="{ width: scrollPercent + '%' }"></div>
  </div>
</template>
