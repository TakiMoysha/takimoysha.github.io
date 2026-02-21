<template>
  <select class="select select-md bg-base-200 text-base-content border-base-300" v-model="currentTheme"
    @change="setTheme">
    <option value="auto">Auto</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
    <DevOnly>
      <option value="halloween">Halloween</option>
      <option value="biopunk">Biopunk</option>
    </DevOnly>
  </select>
</template>

<script setup lang="ts">
const currentTheme = ref('auto');

function setTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme.value);
  localStorage.setItem('theme', currentTheme.value);
}

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
