<template>
  <div>
    <select ref="themeSelect" data-choose-theme class="select select-md">
      <option disabled value="nord">Nord</option>
      <option value="dark">Dark</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { themeChange } from 'theme-change';

const themeSelect = ref<HTMLSelectElement | null>(null);

onMounted(() => {
  themeChange();
});
</script>
