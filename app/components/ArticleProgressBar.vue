<template>
  <div id="scroll-progress-bar" class="fixed top-0 left-0 z-9999 w-0 h-px transition-[width] duration-100 ease-out"
    :style="{ width: scrollPercent + '%', backgroundColor: 'var(--accent)' }" />
</template>

<script setup lang="ts">
const scrollPercent = ref(0);

const updateScrollProgress = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  scrollPercent.value = (scrollTop / (scrollHeight - clientHeight)) * 100;
};

onMounted(() => {
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress);
});
</script>
