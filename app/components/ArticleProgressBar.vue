<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const progressBar = ref<HTMLDivElement | null>(null);

const updateProgressBar = () => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  if (progressBar.value) progressBar.value.style.width = `${scrolled}%`;
};

if (progressBar.value) progressBar.value.style.width = '0';

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', updateProgressBar);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', updateProgressBar);
  }
});
</script>

<template>
  <div class="top-0 w-full h-0.5 bg-transparent pb-1">
    <div ref="progressBar" class="w-0 h-0.5 bg-primary" />
  </div>
</template>
