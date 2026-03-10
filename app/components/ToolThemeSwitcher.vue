<script setup lang="ts">
const site_config = useAppConfig().SITE_CONFIG;
const currentTheme = ref('auto');
const themes = ['auto', ...site_config.themes];

function setTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme.value);
  localStorage.setItem('theme', currentTheme.value);
}

watch(currentTheme, () => {
  setTheme();
});

onMounted(() => {
  const saved = localStorage.getItem('theme');

  if (saved) {
    currentTheme.value = saved;
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    currentTheme.value = 'halloween';
  }
  setTheme();
});
</script>

<template>
  <USelect class="w-32 bg-base-100 text-base-content" v-model="currentTheme" :items="themes" />
</template>
